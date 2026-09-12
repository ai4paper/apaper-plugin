#!/usr/bin/env node
import { constants } from "node:fs";
import { access, copyFile, lstat, mkdir, readFile, readdir, realpath, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { randomUUID } from "node:crypto";

const toolkit = fileURLToPath(new URL("../", import.meta.url));
const clients = {
  "claude-code": { config: ".mcp.json", skills: ".claude/skills", template: "claude-code.json", key: "mcpServers" },
  codex: { config: ".codex/config.toml", skills: ".agents/skills", template: "codex.toml", key: "mcp_servers" },
  opencode: { config: "opencode.json", skills: ".agents/skills", template: "opencode.json", key: "mcp" },
};

const help = `Install APaper MCP configuration and skills into a repository.

Usage: ./install.sh [--client CLIENT[,CLIENT...]] [--repo PATH]
       apaper-install [--client CLIENT[,CLIENT...]] [--repo PATH]

Clients: claude-code (aliases: claude, claudecode), codex, opencode, all
Repeat --client or use commas to select multiple clients.
Omitted options are prompted in a terminal; the repository defaults to the
current directory. Non-interactive use requires both --client and --repo.

Existing MCP entries are preserved. Changed files are backed up under
<repo>/.apaper-backups/. No global client settings are modified.
Requires Node.js 20+ and npm/npx. Use Bash on Linux, macOS, or WSL.
`;

function selectClients(values) {
  const aliases = { claude: "claude-code", claudecode: "claude-code", "1": "claude-code", "2": "codex", "3": "opencode", "4": "all" };
  const selected = values.flatMap(value => value.toLowerCase().split(/[,\s]+/)).filter(Boolean)
    .map(value => aliases[value] ?? value);
  if (!selected.length) throw new Error("Select at least one client.");
  for (const value of selected) {
    if (value !== "all" && !Object.hasOwn(clients, value)) throw new Error(`Unknown client: ${value}`);
  }
  return selected.includes("all") ? Object.keys(clients) : [...new Set(selected)];
}

async function statIfExists(path) {
  try { return await lstat(path); }
  catch (error) { if (error.code === "ENOENT") return undefined; throw error; }
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object/table.`);
  }
  return value;
}

// Refuse symlinks in destination paths so a repo-scoped install stays in the repo.
async function checkDestination(repo, path) {
  const rel = relative(repo, path);
  if (!rel || rel.startsWith(`..${sep}`) || rel === "..") throw new Error(`Invalid destination: ${path}`);
  let current = repo;
  const parts = rel.split(sep);
  for (let index = 0; index < parts.length; index++) {
    current = join(current, parts[index]);
    const stat = await statIfExists(current);
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error(`Refusing symlink destination: ${current}`);
    if (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile()) {
      throw new Error(`Unexpected file type: ${current}`);
    }
  }
}

async function skillFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await skillFiles(join(directory, entry.name), name));
    else if (entry.isFile()) files.push(name);
    else throw new Error(`Unsupported packaged skill file: ${name}`);
  }
  return files;
}

export async function install({ repo: target, selected, log = console.log }) {
  const { parse: parseToml, stringify: stringifyToml } = await import("smol-toml");
  const { parse, modify, applyEdits, printParseErrorCode } = await import("jsonc-parser");
  const repo = await realpath(resolve(target));
  if (!(await lstat(repo)).isDirectory()) throw new Error(`Repository is not a directory: ${repo}`);
  const names = selectClients(selected);
  const changes = new Map();
  const messages = [];

  async function plan(path, content) {
    await checkDestination(repo, path);
    const stat = await statIfExists(path);
    const previous = stat ? await readFile(path) : undefined;
    const next = Buffer.from(content);
    if (!previous?.equals(next)) changes.set(path, { content: next, previous, mode: stat?.mode });
  }

  for (const name of names) {
    const client = clients[name];
    let config = client.config;
    if (name === "opencode") {
      const json = await statIfExists(join(repo, "opencode.json"));
      const jsonc = await statIfExists(join(repo, "opencode.jsonc"));
      if (json && jsonc) throw new Error("Both opencode.json and opencode.jsonc exist. Consolidate them before installing.");
      if (jsonc) config = "opencode.jsonc";
    }
    const path = join(repo, config);
    await checkDestination(repo, path);
    const exists = await statIfExists(path);
    const original = exists ? await readFile(path, "utf8") : "";
    const template = await readFile(join(toolkit, "mcp", client.template), "utf8");
    let updated;
    if (name === "codex") {
      const data = parseToml(original);
      const servers = data[client.key] === undefined ? {} : object(data[client.key], config);
      if (Object.hasOwn(servers, "apaper-mcp")) {
        object(servers["apaper-mcp"], `${config}: apaper-mcp`);
      } else {
        updated = `${original}${original && !original.endsWith("\n") ? "\n" : ""}${original ? "\n" : ""}${template}`;
        try { parseToml(updated); }
        catch {
          // Inline TOML tables are closed; serialize only when appending is invalid.
          data[client.key] = { ...servers, ...parseToml(template)[client.key] };
          updated = stringifyToml(data);
          messages.push(`${config}: expanded inline TOML tables; original formatting is in the backup.`);
        }
      }
    } else {
      const errors = [];
      const source = exists ? original : "{}\n";
      const data = name === "claude-code" ? JSON.parse(source) : parse(source, errors, { allowTrailingComma: true });
      if (errors.length) throw new Error(`${config}: invalid JSONC (${printParseErrorCode(errors[0].error)}).`);
      object(data, config);
      const servers = data[client.key] === undefined ? {} : object(data[client.key], config);
      if (Object.hasOwn(servers, "apaper-mcp")) {
        object(servers["apaper-mcp"], `${config}: apaper-mcp`);
      } else {
        const settings = JSON.parse(template);
        updated = applyEdits(source, modify(source, [client.key, "apaper-mcp"], settings[client.key]["apaper-mcp"], {
          formattingOptions: { insertSpaces: true, tabSize: 2, eol: original.includes("\r\n") ? "\r\n" : "\n" },
        }));
        if (!exists && settings.$schema) {
          updated = applyEdits(updated, modify(updated, ["$schema"], settings.$schema, {
            formattingOptions: { insertSpaces: true, tabSize: 2 },
          }));
        }
      }
    }
    if (updated === undefined) messages.push(`${config}: kept existing apaper-mcp configuration.`);
    else await plan(path, updated);

    // OpenCode and Codex share the standard .agents/skills discovery directory.
    for (const file of await skillFiles(join(toolkit, "skills"))) {
      await plan(join(repo, client.skills, file), await readFile(join(toolkit, "skills", file)));
    }
  }

  // Validate every destination before backing up or writing anything.
  const backupRoot = join(repo, ".apaper-backups", `${Date.now()}-${randomUUID()}`);
  const backups = [...changes].filter(([, change]) => change.previous !== undefined);
  for (const [path] of backups) await checkDestination(repo, join(backupRoot, relative(repo, path)));
  for (const [path] of backups) {
    const backup = join(backupRoot, relative(repo, path));
    await mkdir(dirname(backup), { recursive: true });
    await copyFile(path, backup, constants.COPYFILE_EXCL);
  }
  if (backups.length) log(`Backups: ${backupRoot}`);
  for (const [path, change] of changes) {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.apaper-${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, change.content, { flag: "wx", mode: change.mode });
      await rename(temporary, path);
    } finally { await rm(temporary, { force: true }); }
  }
  for (const message of messages) log(message);
  log(`Installed APaper for ${names.join(", ")} in ${repo} (${changes.size} files changed).`);
  log("Restart your client in this repository. The MCP server runs on demand via npx.");
  if (names.includes("codex")) log("Codex loads project MCP configuration only after you trust the repository.");
  if (names.includes("claude-code")) log("Claude Code may ask you to approve this project's MCP server.");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log(help); return; }
  const selected = [];
  let repo;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg !== "--client" && arg !== "--repo") throw new Error(`Unknown option: ${arg}. Use --help.`);
    const value = args[++index];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}.`);
    if (arg === "--client") selected.push(value);
    else repo = value;
  }
  if (!selected.length || !repo) {
    if (!process.stdin.isTTY) throw new Error("Non-interactive installation requires --client and --repo. Use --help.");
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    try {
      if (!selected.length) selected.push(await prompt.question("Client: 1) Claude Code  2) Codex  3) OpenCode  4) All\nSelect names or numbers (comma-separated): "));
      selectClients(selected);
      if (!repo) repo = (await prompt.question(`Repository path [${process.cwd()}]: `)).trim() || process.cwd();
    } finally { prompt.close(); }
  }
  if (repo === "~" || repo.startsWith("~/")) {
    const { homedir } = await import("node:os");
    repo = join(homedir(), repo.slice(2));
  }
  await access(resolve(repo), constants.W_OK);
  await install({ repo, selected });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === await realpath(process.argv[1])) {
  main().catch(error => { console.error(`APaper: ${error.message}`); process.exitCode = 1; });
}
