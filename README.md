# apaper-plugin

A Claude Code plugin for academic paper authoring. It bundles writing,
figure, and PDF skills together with the [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp)
paper-research MCP server so a single install gives Claude Code everything
it needs to search the literature, draft IEEE-style prose, generate TikZ
figures, and process PDFs.

## What's inside

### Skills (`skills/`)

Sourced from [`isomoes/skills`](https://github.com/isomoes/skills):

| Skill                  | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `ieee-journal-writing` | Revise and strengthen IEEE-style journal writing.        |
| `isomoes-writing`      | Weekly reports and technical blog posts.                 |
| `creating-figures`     | Publication-quality scientific figures with TikZ.        |
| `pdf`                  | PDF extraction, generation, merge/split, and forms.      |
| `find-skills`          | Discover and install additional agent skills.            |

Once the plugin is enabled, the skills are namespaced under the plugin
name, e.g. `/apaper-plugin:ieee-journal-writing`.

### MCP server (`.mcp.json`)

Wires up [`@ai4paper/apaper-mcp`](https://www.npmjs.com/package/@ai4paper/apaper-mcp),
which exposes tools for searching IACR / DBLP / Google Scholar, collecting
BibTeX entries, and downloading IACR PDFs. The server is launched on
demand via `npx -y @ai4paper/apaper-mcp`, so no global install is needed.

## Install

### From a marketplace (recommended)

Add the marketplace that hosts this plugin and install:

```text
/plugin marketplace add ai4paper/apaper-plugin
/plugin install apaper-plugin
```

### Local development

Clone this repo and point Claude Code at it directly:

```bash
git clone https://github.com/ai4paper/apaper-plugin
claude --plugin-dir ./apaper-plugin
```

After editing skills or the manifest, run `/reload-plugins` in Claude
Code to pick up the changes without restarting.

## Requirements

- [Claude Code](https://code.claude.com/) with plugin support
- `npx` on `PATH` (ships with Node.js) for the MCP server
- For the `creating-figures` skill: a working LaTeX/TikZ toolchain
- For the `pdf` skill: Python tooling as documented inside the skill

## Layout

```text
apaper-plugin/
├── .claude-plugin/
│   └── plugin.json        # Plugin manifest
├── .mcp.json              # apaper-mcp server registration
├── skills/                # Bundled skills (each has a SKILL.md)
│   ├── creating-figures/
│   ├── find-skills/
│   ├── ieee-journal-writing/
│   ├── isomoes-writing/
│   └── pdf/
├── LICENSE
└── README.md
```

## License

MIT. See [LICENSE](./LICENSE).
