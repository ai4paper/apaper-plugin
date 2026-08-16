import * as mcpClient from "@deepseek-ai/dsh-mcp-client";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const skillNames = ["writing", "creating-figures"];
const skillsRoot = fileURLToPath(new URL("../skills/", import.meta.url));
const mcpCounterKey = Symbol.for("@ai4paper/apaper-plugin/dsh:mcp-counts");
const mcpInstanceCounts =
  globalThis[mcpCounterKey] ?? (globalThis[mcpCounterKey] = new WeakMap());

function nextMcpServerName(root) {
  const instance = (mcpInstanceCounts.get(root) ?? 0) + 1;
  mcpInstanceCounts.set(root, instance);
  return `apaper-mcp-v2-${instance}`;
}

function parseSkill(source, path) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) {
    throw new Error(`apaper-plugin: ${path} has no YAML frontmatter`);
  }

  const [, frontmatter, content] = match;
  const name = /^name:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim();
  if (!name || !description) {
    throw new Error(`apaper-plugin: ${path} must declare name and description`);
  }

  return { name, description, content: content.trimStart() };
}

export async function registerPackagedSkills(ctx) {
  for (const expectedName of skillNames) {
    const path = resolve(skillsRoot, expectedName, "SKILL.md");
    const parsed = parseSkill(await readFile(path, "utf8"), path);
    if (parsed.name !== expectedName) {
      throw new Error(
        `apaper-plugin: expected skill ${expectedName}, found ${parsed.name}`,
      );
    }

    ctx.skills.register({
      ...parsed,
      source: "bundled",
      provider: "apaper-plugin",
      resourceBase: { kind: "directory", path: dirname(path) },
      path,
    });
  }
}

export const name = "apaper-plugin";
export const inject = ["skills", "tools"];

export async function apply(ctx) {
  await registerPackagedSkills(ctx);
  await ctx.plugin(mcpClient, {
    // DSH keeps superseded preset generations mounted. Give each generation a
    // distinct MCP namespace so editing or copying a preset cannot collide
    // with an older generation in the same process.
    serverName: nextMcpServerName(ctx.root),
    transport: "stdio",
    command: "npx",
    args: ["-y", "@ai4paper/apaper-mcp"],
    failOnStartupError: true,
  }).await();
}
