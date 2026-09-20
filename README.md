# APaper plugin

Academic paper-authoring tools packaged as a native **Codex plugin**: literature
research through MCP, academic writing skills, and publication-quality figures.
MCP templates and portable skills are also included for other compatible clients.

| Tool | Purpose |
| --- | --- |
| [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp) | Paper research and literature search through MCP. |
| [`writing`](skills/writing/SKILL.md) | Revise academic prose, with IEEE journal, LaTeX, and theorem-statement guidance. |
| [`creating-figures`](skills/creating-figures/SKILL.md) | Publication-quality TikZ and CeTZ figures, including examples and rendering guidance. |

The skills are sourced from [`isomoes/skills`](https://github.com/isomoes/skills).

## Install the Codex plugin

Use a Codex version with `codex plugin` support. Install **uv/uvx** and
**Python 3.12+** for the research MCP server, with `uvx` on Codex's `PATH`.

Add the marketplace and install APaper:

```bash
codex plugin marketplace add ai4paper/apaper-plugin
codex plugin add apaper-plugin@ai4paper
```

Restart Codex and start a new thread in your paper repository. The plugin bundles
`apaper-mcp`, `writing`, and `creating-figures`. Codex manages installation and
updates. The first MCP launch downloads `apaper-mcp` from PyPI.
Figure compilation additionally needs LaTeX or Typst, as described in the skill.

In the Codex app, open the plugins directory, choose the **AI4Paper** marketplace,
and select **APaper**. Try these prompts:

- "Use APaper to find related papers for my research topic."
- "Use APaper to revise this abstract for clarity and precision."
- "Use APaper to create a TikZ architecture diagram for this method."

To test a local checkout before publishing, run from this repository:

```bash
codex plugin marketplace add .
codex plugin add apaper-plugin@ai4paper
```

Use either the local checkout or GitHub as the source for the `ai4paper`
marketplace. To switch sources, run `codex plugin marketplace remove ai4paper`
before adding the other source.

For updates from GitHub:

```bash
codex plugin marketplace upgrade ai4paper
codex plugin add apaper-plugin@ai4paper
```

Then start a new thread. To uninstall, run
`codex plugin remove apaper-plugin@ai4paper`.

If you previously used the repository installer for Codex, remove its
`apaper-mcp` entry from your paper repository's `.codex/config.toml` and its copied
`.agents/skills/{writing,creating-figures}` directories before switching to the
plugin. Save local customizations first; OpenCode may also use those shared
skills. This avoids loading APaper twice.

The native package uses [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json),
[`.mcp.json`](.mcp.json), and the existing [`skills/`](skills/). The
[marketplace catalog](.agents/plugins/marketplace.json) points at the repository
root, so GitHub installations use the skills bundled in the same revision.
See the [official plugin packaging documentation](https://developers.openai.com/plugins/build/plugins).

## Manual installation and other clients

[`mcp/`](mcp/) contains ready-to-merge client configuration examples. Copy the
two folders under [`skills/`](skills/) into your client's supported skill
directory, keeping each folder's `SKILL.md` and supporting files together.
Any client supporting stdio MCP can launch `uvx` with arguments `["apaper-mcp"]`.

## Development and publishing

Use Node.js 24+ for the TypeScript tests:

```bash
npm ci
npm run typecheck
npm test
npm run pack:check
```

The npm package ships the native Codex manifest, MCP configuration, MCP templates,
and skills. Node.js and npm are used for development and publishing. Keep the
version in `.codex-plugin/plugin.json` aligned with `package.json` and
`package-lock.json` when preparing a release. Release publishing uses npm trusted
publishing through GitHub OIDC. See
[`prompt/release.md`](prompt/release.md) for the release process.

## License

MIT. See [LICENSE](LICENSE).
