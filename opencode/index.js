import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const skillsRoot = fileURLToPath(new URL("../skills/", import.meta.url));

export const mcpServer = { type: "local", command: ["uvx", "apaper-mcp"] };

export function parseSkill(text, path) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) throw new Error(`Missing frontmatter in ${path}`);
  const fields = Object.fromEntries(
    match[1].split(/\r?\n/).flatMap(line => {
      const field = /^([\w-]+):\s*(.*)$/.exec(line);
      return field ? [[field[1], field[2].trim().replace(/^(["'])(.*)\1$/, "$2")]] : [];
    }),
  );
  if (!fields.name) throw new Error(`Missing skill name in ${path}`);
  return {
    id: fields.name,
    name: fields.name,
    description: fields.description,
    path,
    content: text.slice(match[0].length).trimStart(),
  };
}

export async function loadSkills() {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const directories = entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  return Promise.all(directories.map(async directory => {
    const path = join(skillsRoot, directory, "SKILL.md");
    return parseSkill(await readFile(path, "utf8"), path);
  }));
}

export default {
  id: "ai4paper.apaper",
  async setup(ctx) {
    const skills = await loadSkills();
    await ctx.mcp.transform(editor => {
      if (!editor.get("apaper-mcp")) editor.set("apaper-mcp", mcpServer);
    });
    await ctx.skill.transform(editor => {
      for (const skill of skills) if (!editor.get(skill.id)) editor.add(skill);
    });
  },
};
