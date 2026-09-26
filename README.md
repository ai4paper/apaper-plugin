# APaper plugin

Academic paper-authoring tools for **Codex** and **OpenCode V2**: literature
research through MCP, academic writing, and publication-quality figures.

| Tool | Purpose |
| --- | --- |
| [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp) | Paper research and literature search through MCP. |
| [`writing`](skills/writing/SKILL.md) | Revise academic prose, with IEEE journal, LaTeX, and theorem-statement guidance. |
| [`creating-figures`](skills/creating-figures/SKILL.md) | Publication-quality TikZ and CeTZ figures, including examples and rendering guidance. |

The skills are sourced from [`isomoes/skills`](https://github.com/isomoes/skills).

**Requirements:** `uvx` and Python 3.12+ on the client's `PATH` for `apaper-mcp`
(downloaded from PyPI on first launch), and LaTeX or Typst to compile figures.

## Codex

```bash
codex plugin marketplace add ai4paper/apaper-plugin
codex plugin add apaper-plugin@ai4paper
```

Restart Codex and start a new thread in your paper repository. Try:

- "Use APaper to find related papers for my research topic."
- "Use APaper to revise this abstract for clarity and precision."
- "Use APaper to create a TikZ architecture diagram for this method."

Other tasks:

- **Update:** `codex plugin marketplace upgrade ai4paper`, then rerun `codex plugin add apaper-plugin@ai4paper`.
- **Uninstall:** `codex plugin remove apaper-plugin@ai4paper`.
- **Local checkout:** run `codex plugin marketplace add .` in this repository instead. Run `codex plugin marketplace remove ai4paper` before switching sources.
- **Migrating from the old installer:** remove its `apaper-mcp` entry from `.codex/config.toml` and the copied `.agents/skills/{writing,creating-figures}` to avoid loading APaper twice.

## OpenCode

For one paper repository, add APaper to its `opencode.json` or
`.opencode/opencode.json`. OpenCode installs it on the next start:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["@ai4paper/apaper-plugin"]
}
```

For every project, install it globally:

```bash
opencode plugin add @ai4paper/apaper-plugin
```

- **Update:** `opencode plugin update @ai4paper/apaper-plugin` for global installs; for a repository, pin a version such as `"@ai4paper/apaper-plugin@0.4.0"`.
- **Local checkout:** use `"/path/to/apaper-plugin/opencode"` as the `plugins` entry.
- **Existing setup:** your own `apaper-mcp` server or same-named skills take precedence; remove manual copies to use the bundled versions.

## Other clients

Merge an example from [`mcp/`](mcp/) into your client configuration, and copy the
folders under [`skills/`](skills/) into its skill directory, keeping each folder
intact. Any stdio MCP client can run `uvx apaper-mcp`.

## Development

Use Node.js 24+:

```bash
npm ci
npm run typecheck
npm test
npm run pack:check
```

The npm package ships the Codex manifest ([`.codex-plugin/`](.codex-plugin/),
[`.mcp.json`](.mcp.json)), the OpenCode entry point
([`opencode/index.js`](opencode/index.js)), MCP templates, and skills. Keep the
versions in `.codex-plugin/plugin.json`, `package.json`, and `package-lock.json`
aligned. Releases publish through npm trusted publishing; see
[`prompt/release.md`](prompt/release.md).

## License

MIT. See [LICENSE](LICENSE).
