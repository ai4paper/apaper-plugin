import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const json = async (path: string) => JSON.parse(await readFile(path, "utf8"));

test("marketplace resolves the bundled plugin with matching release metadata", async () => {
  const marketplace = await json(join(root, ".agents/plugins/marketplace.json"));
  const [entry] = marketplace.plugins;
  assert.equal(marketplace.name, "ai4paper");
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(entry.source.source, "local");
  assert.ok(entry.source.path.startsWith("./"));
  const pluginRoot = resolve(root, entry.source.path);
  assert.equal(pluginRoot, resolve(root));
  const manifest = await json(join(pluginRoot, ".codex-plugin/plugin.json"));
  const pkg = await json(join(root, "package.json"));
  const lock = await json(join(root, "package-lock.json"));
  assert.equal(entry.name, manifest.name);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.version, lock.version);
  assert.equal(manifest.version, lock.packages[""].version);
  assert.equal(entry.policy.installation, "AVAILABLE");
  assert.equal(entry.policy.authentication, "ON_INSTALL");
  assert.equal(entry.category, manifest.interface.category);
  assert.ok(manifest.interface.defaultPrompt.length > 0);
  assert.ok(manifest.interface.defaultPrompt.length <= 3);
  for (const prompt of manifest.interface.defaultPrompt) assert.ok(prompt.length <= 128);
  assert.deepEqual(
    await json(join(pluginRoot, manifest.mcpServers)),
    await json(join(root, "mcp/claude-code.json")),
  );
});

test("npm archive contains a standalone native plugin and all skill resources", async t => {
  const work = await mkdtemp(join(tmpdir(), "apaper-package-"));
  t.after(() => rm(work, { recursive: true, force: true }));
  const [packed] = JSON.parse(execFileSync("npm", [
    "pack", "--json", "--ignore-scripts", "--cache", join(work, "npm-cache"),
    "--pack-destination", work,
  ], { cwd: root, encoding: "utf8" }));
  execFileSync("tar", ["-xzf", join(work, packed.filename), "-C", work]);
  const installed = join(work, "package");
  const pkg = await json(join(installed, "package.json"));
  assert.equal(pkg.bin, undefined, "The plugin must not expose an installer command");
  assert.deepEqual(pkg.dependencies ?? {}, {}, "The plugin needs no npm runtime dependencies");
  const manifest = await json(join(installed, ".codex-plugin/plugin.json"));
  const config = await json(join(installed, manifest.mcpServers));
  assert.equal(config.mcpServers["apaper-mcp"].command, "uvx");
  assert.deepEqual(config.mcpServers["apaper-mcp"].args, ["apaper-mcp"]);
  const sourceSkills = join(root, "skills");
  const packagedSkills = join(installed, manifest.skills);
  assert.deepEqual((await readdir(packagedSkills)).sort(), ["creating-figures", "writing"]);
  for (const entry of await readdir(sourceSkills, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const source = join(entry.parentPath, entry.name);
    const relative = source.slice(sourceSkills.length + 1);
    assert.equal(
      await readFile(join(packagedSkills, relative), "utf8"),
      await readFile(source, "utf8"),
      `Missing or changed skill resource: ${relative}`,
    );
  }
  for (const file of packed.files) {
    assert.notEqual(file.path, "install.sh");
    assert.ok(!file.path.startsWith("scripts/"));
    assert.ok(!file.path.startsWith("node_modules/"));
    assert.ok(!file.path.startsWith("test/"));
    assert.ok(!file.path.startsWith(".git/"));
  }
});
