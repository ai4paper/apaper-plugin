# apaper-plugin

An academic paper-authoring toolkit for AI coding agents. It bundles writing
and figure skills together with the [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp)
paper-research MCP server so a single setup gives your agent everything it
needs to search the literature, draft IEEE-style prose, and generate publication-
quality figures.

Install it as a [Claude Code](https://code.claude.com/) plugin, or add the
skills and MCP server to [OpenAI Codex](https://developers.openai.com/codex/)
(or any other agent supported by the [`skills`](https://github.com/vercel-labs/skills)
CLI).

## What's inside

### Skills (`skills/`)

Sourced from [`isomoes/skills`](https://github.com/isomoes/skills):

| Skill              | Purpose                                                          |
| ------------------ | --------------------------------------------------------------- |
| `writing`          | Revise and strengthen academic prose; applies IEEE journal rules for journal work. |
| `creating-figures` | Publication-quality scientific figures (TikZ/CeTZ).             |

### MCP server (`.mcp.json`)

Wires up [`@ai4paper/apaper-mcp`](https://www.npmjs.com/package/@ai4paper/apaper-mcp),
which exposes tools for searching IACR / DBLP / Google Scholar / arXiv,
collecting BibTeX entries, and downloading papers. The server is launched on
demand via `npx -y @ai4paper/apaper-mcp`, so no global install is needed.

## Install for Claude Code

### From a marketplace (recommended)

This repo ships its own `.claude-plugin/marketplace.json`, so you can add
it as a marketplace and install in two commands:

```text
/plugin marketplace add ai4paper/apaper-plugin
/plugin install apaper-plugin@apaper
```

The bundled MCP server is registered automatically. Once the plugin is
enabled, the skills are namespaced under the plugin name, e.g.
`/apaper-plugin:writing`.

## Install for Codex

Codex doesn't use the Claude plugin system, so the skills and MCP server are
added separately.

### Skills — via the `skills` CLI

Use the [`skills`](https://github.com/vercel-labs/skills) CLI (`npx skills`)
to copy the skills into Codex. No global install — `npx` fetches it on demand:

```bash
# Install both skills for Codex (project-local, under .agents/skills/)
npx skills add ai4paper/apaper-plugin -a codex

# Install globally instead (under ~/.codex/skills/)
npx skills add ai4paper/apaper-plugin -a codex -g

# Pick specific skills by name
npx skills add ai4paper/apaper-plugin -a codex --skill writing creating-figures
```

Add `-y` to skip the confirmation prompt, or `--list` to preview the
available skills without installing.

### MCP server — via `config.toml`

Register `apaper-mcp` in Codex's config (`~/.codex/config.toml` for all
projects, or `.codex/config.toml` inside a trusted project):

```toml
[mcp_servers.apaper-mcp]
command = "npx"
args = ["-y", "@ai4paper/apaper-mcp"]
```

Or add it from the command line, which writes the same entry for you:

```bash
codex mcp add apaper-mcp -- npx -y @ai4paper/apaper-mcp
```

Run `/mcp` in the Codex TUI to confirm the server is connected.

## Local development

Clone this repo and point Claude Code at it directly:

```bash
git clone https://github.com/ai4paper/apaper-plugin
claude --plugin-dir ./apaper-plugin
```

After editing skills or the manifest, run `/reload-plugins` in Claude
Code to pick up the changes without restarting.

## License

MIT. See [LICENSE](./LICENSE).
