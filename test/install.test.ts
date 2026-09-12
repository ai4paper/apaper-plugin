import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmod, cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parse as parseToml } from "smol-toml";
import { parse as parseJsonc } from "jsonc-parser";
import { install } from "../scripts/install.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const shell = join(root, "install.sh");

async function fixture(t: { after(fn: () => Promise<void>): void }) {
  const repo = await mkdtemp(join(tmpdir(), "apaper paper "));
  t.after(() => rm(repo, { recursive: true, force: true }));
  return repo;
}
async function put(repo: string, path: string, content: string) {
  await mkdir(dirname(join(repo, path)), { recursive: true });
  await writeFile(join(repo, path), content);
}
const read = (repo: string, path: string) => readFile(join(repo, path), "utf8");
const run = (repo: string, selected = ["all"]) => install({ repo, selected, log() {} });

for (const [client, config, skills] of [
  ["claude-code", ".mcp.json", ".claude/skills"],
  ["codex", ".codex/config.toml", ".agents/skills"],
  ["opencode", "opencode.json", ".agents/skills"],
]) {
  test(`shell installs ${client} into a path with spaces, from another cwd`, async t => {
    const repo = await fixture(t);
    const result = spawnSync("bash", [shell, "--client", client, "--repo", repo], { cwd: tmpdir(), encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const source = await read(repo, config);
    const data = client === "codex" ? parseToml(source) : JSON.parse(source);
    const server = data[client === "codex" ? "mcp_servers" : client === "opencode" ? "mcp" : "mcpServers"]["apaper-mcp"];
    if (client === "opencode") {
      assert.deepEqual(server, { type: "local", command: ["uvx", "apaper-mcp"], enabled: true });
    } else {
      assert.equal(server.command, "uvx");
      assert.deepEqual(server.args, ["apaper-mcp"]);
    }
    for (const file of ["writing/SKILL.md", "writing/JOURNAL.md", "creating-figures/SKILL.md", "creating-figures/examples/typst/block-diagram.typ"]) {
      assert.equal(await read(repo, `${skills}/${file}`), await read(root, `skills/${file}`));
    }
    assert.equal((await readdir(repo)).includes("node_modules"), false);
    assert.equal((await readdir(repo)).includes(".apaper-backups"), false);
    assert.equal((await readdir(repo)).includes(client === "claude-code" ? ".agents" : ".claude"), false);
  });
}

test("all installs are idempotent and share Codex/OpenCode skills", async t => {
  const repo = await fixture(t);
  await run(repo);
  const before = await lstat(join(repo, ".agents/skills/writing/SKILL.md"));
  await run(repo);
  assert.equal((await lstat(join(repo, ".agents/skills/writing/SKILL.md"))).mtimeMs, before.mtimeMs);
  assert.equal((await readdir(repo)).includes(".apaper-backups"), false);
  assert.deepEqual((await readdir(join(repo, ".agents/skills"))).sort(), ["creating-figures", "writing"]);
});

test("merges existing configurations, keeps comments, and backs up exact originals", async t => {
  const repo = await fixture(t);
  const originals = {
    ".mcp.json": '{"otherSetting":true,"mcpServers":{"existing":{"command":"custom"}}}\n',
    ".codex/config.toml": '# my settings\nmodel = "custom-model"\n[mcp_servers.existing]\ncommand = "custom"\n',
    "opencode.jsonc": '{\n  // my settings\n  "theme": "custom",\n  "mcp": {"existing": {"type": "local", "command": ["custom"]},},\n}\n',
  };
  for (const [path, content] of Object.entries(originals)) await put(repo, path, content);
  await chmod(join(repo, ".mcp.json"), 0o600);
  await run(repo);
  assert.equal(JSON.parse(await read(repo, ".mcp.json")).mcpServers.existing.command, "custom");
  const toml = await read(repo, ".codex/config.toml");
  assert.ok(toml.startsWith(originals[".codex/config.toml"]));
  assert.equal(parseToml(toml).model, "custom-model");
  const jsonc = await read(repo, "opencode.jsonc");
  assert.ok(jsonc.includes("// my settings"));
  assert.equal(parseJsonc(jsonc).mcp.existing.command[0], "custom");
  assert.equal(parseJsonc(jsonc).mcp["apaper-mcp"].enabled, true);
  assert.equal((await readdir(repo)).includes("opencode.json"), false);
  const [backup] = await readdir(join(repo, ".apaper-backups"));
  for (const [path, content] of Object.entries(originals)) assert.equal(await read(repo, `.apaper-backups/${backup}/${path}`), content);
  assert.equal((await lstat(join(repo, ".mcp.json"))).mode & 0o777, 0o600);
});

test("keeps customized APaper MCP entries unchanged", async t => {
  const repo = await fixture(t);
  const originals = {
    ".mcp.json": '{"mcpServers":{"apaper-mcp":{"command":"custom","env":{"KEY":"value"}}}}',
    ".codex/config.toml": '[mcp_servers."apaper-mcp"]\ncommand = "custom"\nenabled = false\n',
    "opencode.json": '{"mcp":{"apaper-mcp":{"type":"local","command":["custom"],"enabled":false}}}',
  };
  for (const [path, content] of Object.entries(originals)) await put(repo, path, content);
  await run(repo);
  for (const [path, content] of Object.entries(originals)) assert.equal(await read(repo, path), content);
});

test("handles inline TOML tables without losing other settings", async t => {
  const repo = await fixture(t);
  const original = 'model = "mine"\nmcp_servers = { existing = { command = "custom" } }\n';
  await put(repo, ".codex/config.toml", original);
  await run(repo, ["codex"]);
  const data = parseToml(await read(repo, ".codex/config.toml"));
  assert.equal(data.model, "mine");
  assert.deepEqual(data.mcp_servers, { existing: { command: "custom" }, "apaper-mcp": { command: "uvx", args: ["apaper-mcp"] } });
});

test("migrates legacy npm launchers, preserves settings, and backs up originals", async t => {
  const repo = await fixture(t);
  const originals = {
    ".mcp.json": JSON.stringify({ mcpServers: { "apaper-mcp": { type: "stdio", command: "npx", args: ["-y", "@ai4paper/apaper-mcp"], env: { SPIDER_PROXY: "custom" } }, other: { command: "keep" } } }),
    ".codex/config.toml": '# local settings\nmodel = "mine"\n[mcp_servers.apaper-mcp]\ncommand = "npx"\nargs = ["-y", "@ai4paper/apaper-mcp"]\nenabled = false\n[mcp_servers.apaper-mcp.env]\nSPIDER_PROXY = "custom"\n',
    "opencode.jsonc": '{\n// keep this comment\n"mcp":{"apaper-mcp":{"type":"local","command":["npx","-y","@ai4paper/apaper-mcp"],"enabled":false,"timeout":900000,"environment":{"SPIDER_PROXY":"custom"}}}}',
  };
  for (const [path, content] of Object.entries(originals)) await put(repo, path, content);
  await run(repo);
  const claude = JSON.parse(await read(repo, ".mcp.json"));
  assert.deepEqual(claude.mcpServers["apaper-mcp"], { type: "stdio", command: "uvx", args: ["apaper-mcp"], env: { SPIDER_PROXY: "custom" } });
  assert.equal(claude.mcpServers.other.command, "keep");
  const codex = parseToml(await read(repo, ".codex/config.toml"));
  assert.equal(codex.model, "mine");
  assert.deepEqual(codex.mcp_servers, { "apaper-mcp": { command: "uvx", args: ["apaper-mcp"], enabled: false, env: { SPIDER_PROXY: "custom" } } });
  const opencode = await read(repo, "opencode.jsonc");
  assert.ok(opencode.includes("// keep this comment"));
  assert.deepEqual(parseJsonc(opencode).mcp["apaper-mcp"], { type: "local", command: ["uvx", "apaper-mcp"], enabled: false, timeout: 900000, environment: { SPIDER_PROXY: "custom" } });
  const [backup] = await readdir(join(repo, ".apaper-backups"));
  for (const [path, content] of Object.entries(originals)) assert.equal(await read(repo, `.apaper-backups/${backup}/${path}`), content);
  const updated = await Promise.all(Object.keys(originals).map(path => read(repo, path)));
  await run(repo);
  assert.deepEqual(await Promise.all(Object.keys(originals).map(path => read(repo, path))), updated);
  assert.deepEqual(await readdir(join(repo, ".apaper-backups")), [backup]);
});

test("keeps explicitly pinned npm launchers unchanged", async t => {
  const repo = await fixture(t);
  const originals = {
    ".mcp.json": '{"mcpServers":{"apaper-mcp":{"command":"npx","args":["-y","@ai4paper/apaper-mcp@0.2.0"]}}}',
    ".codex/config.toml": '[mcp_servers.apaper-mcp]\ncommand = "npx"\nargs = ["-y", "@ai4paper/apaper-mcp@0.2.0"]\n',
    "opencode.json": '{"mcp":{"apaper-mcp":{"type":"local","command":["npx","-y","@ai4paper/apaper-mcp@0.2.0"]}}}',
  };
  for (const [path, content] of Object.entries(originals)) await put(repo, path, content);
  await run(repo);
  for (const [path, content] of Object.entries(originals)) assert.equal(await read(repo, path), content);
});

test("skill updates back up local edits and keep unrelated files", async t => {
  const repo = await fixture(t);
  await run(repo, ["codex"]);
  await put(repo, ".agents/skills/writing/SKILL.md", "local edits");
  await put(repo, ".agents/skills/writing/notes.md", "notes");
  await put(repo, ".agents/skills/my-skill/SKILL.md", "mine");
  await run(repo, ["codex"]);
  const [backup] = await readdir(join(repo, ".apaper-backups"));
  assert.equal(await read(repo, `.apaper-backups/${backup}/.agents/skills/writing/SKILL.md`), "local edits");
  assert.equal(await read(repo, ".agents/skills/writing/SKILL.md"), await read(root, "skills/writing/SKILL.md"));
  assert.equal(await read(repo, ".agents/skills/writing/notes.md"), "notes");
  assert.equal(await read(repo, ".agents/skills/my-skill/SKILL.md"), "mine");
});

for (const [path, content] of [
  ["opencode.jsonc", "{broken"],
  ["opencode.json", '{"mcp":[]}'],
  [".codex/config.toml", "[broken"],
  [".mcp.json", '{"mcpServers":null}'],
  [".mcp.json", ""],
]) {
  test(`invalid configuration is rejected before writes: ${path} ${content}`, async t => {
    const repo = await fixture(t);
    await put(repo, path, content);
    const before = await readdir(repo);
    await assert.rejects(run(repo));
    assert.equal(await read(repo, path), content);
    assert.deepEqual(await readdir(repo), before);
    if (path.startsWith(".codex")) assert.deepEqual(await readdir(join(repo, ".codex")), ["config.toml"]);
  });
}

test("rejects ambiguous OpenCode files without writing other clients", async t => {
  const repo = await fixture(t);
  await put(repo, "opencode.json", "{}");
  await put(repo, "opencode.jsonc", "{}");
  await assert.rejects(run(repo), /Both opencode/);
  assert.deepEqual((await readdir(repo)).sort(), ["opencode.json", "opencode.jsonc"]);
});

test("refuses destination symlinks without modifying external files", async t => {
  const repo = await fixture(t);
  const outside = await fixture(t);
  await symlink(outside, join(repo, ".agents"));
  await assert.rejects(run(repo), /symlink/);
  assert.deepEqual(await readdir(outside), []);
  assert.deepEqual(await readdir(repo), [".agents"]);
});

test("CLI validates arguments and supports aliases and repeated selections", async t => {
  const repo = await fixture(t);
  for (const args of [[], ["--client"], ["--client", "bad", "--repo", repo], ["--wat"], ["--client", "all", "--repo", join(repo, "missing")]]) {
    const result = spawnSync("bash", [shell, ...args], { encoding: "utf8" });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /APaper:/);
  }
  assert.deepEqual(await readdir(repo), []);
  const result = spawnSync("bash", [shell, "--client", "claudecode", "--client", "codex", "--repo", repo], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal((await readdir(repo)).includes("opencode.json"), false);
});

test("npm-style symlink entrypoint executes and package ships only portable tools", async t => {
  const repo = await fixture(t);
  const bin = join(repo, "apaper-install");
  await symlink(join(root, "scripts/install.mjs"), bin);
  assert.match(execFileSync(process.execPath, [bin, "--help"], { encoding: "utf8" }), /Usage:/);
  const manifest = JSON.parse(await read(root, "package.json"));
  assert.equal(manifest.exports, undefined);
  assert.equal(manifest.dependencies["@deepseek-ai/dsh-mcp-client"], undefined);
  assert.deepEqual(manifest.files, ["install.sh", "scripts", "mcp", "skills", "README.md", "LICENSE"]);
});

async function onlineFixture(t: { after(fn: () => Promise<void>): void }) {
  const work = await fixture(t);
  const repo = join(work, "paper");
  const downloads = join(work, "downloads");
  const bin = join(work, "bin");
  const payload = join(work, "archive", "apaper-plugin");
  for (const path of [repo, downloads, bin, payload]) await mkdir(path, { recursive: true });
  await cp(shell, join(work, "install.sh"));
  for (const path of ["package.json", "scripts", "skills", "mcp", "node_modules/jsonc-parser", "node_modules/smol-toml"]) {
    await cp(join(root, path), join(payload, path), { recursive: true });
  }
  const archive = join(work, "toolkit.tar.gz");
  execFileSync("tar", ["-czf", archive, "-C", join(work, "archive"), "apaper-plugin"]);
  // Mock only the HTTP transport; extract the real toolkit and run its installer.
  await put(bin, "curl", `#!/usr/bin/env bash
set -eu
printf '%s\\n' "$@" > "$APAPER_FETCH_LOG"
if [[ "\${APAPER_FETCH_FAIL:-}" == "1" ]]; then
  echo 'curl: simulated download failure' >&2
  exit 22
fi
while [[ "$#" -gt 0 ]]; do
  if [[ "$1" == "--output" ]]; then
    cp "$APAPER_TEST_ARCHIVE" "$2"
    exit
  fi
  shift
done
exit 1
`);
  await chmod(join(bin, "curl"), 0o755);
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    TMPDIR: downloads,
    APAPER_REF: "release/test",
    APAPER_TEST_ARCHIVE: archive,
    APAPER_FETCH_LOG: join(work, "fetch.log"),
  };
  return { work, repo, downloads, env };
}

for (const mode of ["downloaded file", "stdin pipe"]) {
  test(`online bootstrap installs from a ${mode} and removes its temporary toolkit`, async t => {
    const { work, repo, downloads, env } = await onlineFixture(t);
    const args = ["--client", "all", "--repo", repo];
    const result = mode === "downloaded file"
      ? spawnSync("bash", [join(work, "install.sh"), ...args], { cwd: repo, env, encoding: "utf8" })
      : spawnSync("bash", ["-s", "--", ...args], { cwd: repo, env, input: await read(root, "install.sh"), encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(await read(work, "fetch.log"), /https:\/\/codeload.github.com\/ai4paper\/apaper-plugin\/tar.gz\/release%2Ftest/);
    assert.equal(JSON.parse(await read(repo, ".mcp.json")).mcpServers["apaper-mcp"].command, "uvx");
    assert.ok(parseToml(await read(repo, ".codex/config.toml")).mcp_servers);
    assert.equal(JSON.parse(await read(repo, "opencode.json")).mcp["apaper-mcp"].enabled, true);
    assert.equal(await read(repo, ".agents/skills/writing/SKILL.md"), await read(root, "skills/writing/SKILL.md"));
    assert.deepEqual(await readdir(downloads), []);
    assert.equal((await readdir(repo)).includes("node_modules"), false);
  });
}

test("standalone help works without downloading the toolkit", async t => {
  const work = await fixture(t);
  await cp(shell, join(work, "install.sh"));
  const result = spawnSync("bash", [join(work, "install.sh"), "--help"], { cwd: work, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage:/);
  assert.deepEqual(await readdir(work), ["install.sh"]);
});

for (const failure of ["download", "archive", "installer"]) {
  test(`online bootstrap cleans up after ${failure} failure`, async t => {
    const { work, repo, downloads, env } = await onlineFixture(t);
    if (failure === "archive") await writeFile(env.APAPER_TEST_ARCHIVE, "broken archive");
    const result = spawnSync("bash", [join(work, "install.sh"), "--client", failure === "installer" ? "invalid" : "all", "--repo", repo], {
      cwd: repo,
      env: { ...env, APAPER_FETCH_FAIL: failure === "download" ? "1" : "" },
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.deepEqual(await readdir(downloads), []);
    assert.deepEqual(await readdir(repo), []);
  });
}
