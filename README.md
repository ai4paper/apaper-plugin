# apaper-plugin

An academic paper-authoring toolkit for AI coding agents. It bundles writing
and figure skills together with the [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp)
paper-research MCP server so a single setup gives your agent everything it
needs to search the literature, draft IEEE-style prose, and generate publication-
quality figures.

Install it as a [Claude Code](https://code.claude.com/) plugin, load the
standalone npm plugin in [OpenCode](https://opencode.ai), or add the skills
and MCP server to [OpenAI Codex](https://developers.openai.com/codex/)
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

### OpenCode plugin (`index.ts`)

The npm package exports an OpenCode plugin that registers the packaged skills
and the Python `apaper-mcp` server automatically. The MCP server runs through
[`uvx`](https://docs.astral.sh/uv/guides/tools/), so it stays independently
updated without being reimplemented in JavaScript.

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

## Install for OpenCode

Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/) so the
plugin can launch the Python MCP server, then install the npm plugin:

```bash
opencode plugin @ai4paper/apaper-plugin
```

Alternatively, add it directly to `opencode.json` or `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@ai4paper/apaper-plugin"]
}
```

OpenCode loads both bundled skills directly from the npm package. The plugin
also registers `apaper-mcp` with the command
`uvx apaper-mcp`. An existing `mcp.apaper-mcp` configuration is preserved, so
you can override or disable the server in your own config. Restart OpenCode
after changing the plugin configuration.

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

Run the OpenCode plugin tests and inspect the npm package contents with:

```bash
npm ci
npm run typecheck
npm test
npm run pack:check
```

Release publishing uses npm trusted publishing through GitHub OIDC. See
[`prompt/release.md`](./prompt/release.md) for the first manual publish and
subsequent tag-release process.

## License

MIT. See [LICENSE](./LICENSE).
