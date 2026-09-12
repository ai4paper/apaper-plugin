# APaper tools

Academic paper-authoring tools for **Claude Code, Codex, and OpenCode**, distributed
as standard MCP configuration and Agent Skills. One `install.sh` installs the
tools into a repository you choose.

| Tool | Purpose |
| --- | --- |
| [`apaper-mcp`](https://github.com/ai4paper/apaper-mcp) | Paper research and literature search through MCP. |
| [`writing`](skills/writing/SKILL.md) | Revise academic prose, with IEEE journal, LaTeX, and theorem-statement guidance. |
| [`creating-figures`](skills/creating-figures/SKILL.md) | Publication-quality TikZ and CeTZ figures, including examples and rendering guidance. |

The skills are sourced from [`isomoes/skills`](https://github.com/isomoes/skills).

## Install

The installer requires **Node.js 20+**, **npm**, **Bash**, **curl**, and **tar** (Linux,
macOS, or WSL). The target repository directory must already exist.
Running the MCP server requires **uv/uvx** and **Python 3.12+**.
Download and run the installer directly:

```bash
curl -fsSL https://raw.githubusercontent.com/ai4paper/apaper-plugin/main/install.sh -o /tmp/apaper-install.sh
bash /tmp/apaper-install.sh
```

Choose Claude Code, Codex, OpenCode, or all three, then enter the repository
path. Multiple client names or numbers can be separated by commas.
Press Enter at the path prompt to use the current working directory.

Or install into a specific repository in one command:

```bash
curl -fsSL https://raw.githubusercontent.com/ai4paper/apaper-plugin/main/install.sh | bash -s -- --client all --repo /path/to/paper
```

Select just the clients you need with the downloaded script:

```bash
bash /tmp/apaper-install.sh --client claude-code --repo /path/to/paper
bash /tmp/apaper-install.sh --client codex --repo /path/to/paper
bash /tmp/apaper-install.sh --client opencode --repo /path/to/paper
bash /tmp/apaper-install.sh --client claude-code,codex --repo "/path/to/my paper"
```

`claude` and `claudecode` are aliases for `claude-code`. You can also repeat
`--client`. Non-interactive runs require both `--client` and `--repo`.
Run `bash /tmp/apaper-install.sh --help` for usage. Piping the script without
options also supports the interactive picker when a terminal is available.

The standalone script downloads a GitHub source archive and installs its parser
dependencies into a temporary folder, then removes that folder on exit. No clone
is needed, and no npm dependencies are added to your paper repo. Downloads use
`main` by default; set `APAPER_REF` to a branch, tag, or commit to select a version:

```bash
APAPER_REF=<tag-or-commit> bash /tmp/apaper-install.sh --client codex --repo /path/to/paper
```

Choose a revision containing the new installer. These online commands become
available after this change is pushed to `main`; earlier tags contain the legacy
DSH plugin. A complete local checkout still supports `./install.sh` and uses its
own files, installing parser dependencies into that checkout when needed.

The client launches the maintained Python MCP server on demand with
`uvx apaper-mcp`; first use requires access to PyPI. Make sure `uvx` is on the
client's `PATH`. Node.js/npm are used for this toolkit's installer.
For IACR PDF downloads, upstream also requires Chromium on `PATH` or Scrapling's
browser runtime (`uvx --from 'scrapling[fetchers]' scrapling install`). Upstream
recommends 15-minute OpenCode timeouts for those browser-assisted downloads;
see its [runtime and MCP setup instructions](https://github.com/ai4paper/apaper-mcp#install-from-pypi).
Figure compilation needs the relevant LaTeX or Typst tools described in the skill.

The npm distribution also exposes the same installer as `apaper-install`:

```bash
npx -y --package @ai4paper/apaper-plugin apaper-install --client codex --repo /path/to/paper
```

This npm command becomes available once a release containing the new installer
is published; earlier releases contain the legacy DSH plugin.

## Files installed

All paths are relative to the selected repository:

| Client | MCP config | Skills |
| --- | --- | --- |
| Claude Code | `.mcp.json` | `.claude/skills/{writing,creating-figures}/` |
| Codex | `.codex/config.toml` | `.agents/skills/{writing,creating-figures}/` |
| OpenCode | `opencode.json` (or existing `opencode.jsonc`) | `.agents/skills/{writing,creating-figures}/` |

Codex and OpenCode share the standard `.agents/skills` directory. Each skill is
copied with all reference files and examples, so the installed tools remain
usable after moving or removing the toolkit checkout. Global client settings
are untouched.

The installer adds the `apaper-mcp` entry while keeping other servers and
settings. The previous default `npx -y @ai4paper/apaper-mcp` launcher is migrated
to `uvx apaper-mcp`, preserving environment variables and other server settings.
Other existing launch commands, including pinned versions, are left as configured.
JSONC comments and normal TOML formatting are preserved. Migrating an old Codex
launcher reserializes its TOML; the original formatting/comments remain in the
backup. If Codex uses an inline `mcp_servers` table that
cannot be extended, the installer reserializes the TOML and reports that its
formatting/comments changed; the original is backed up.

Re-running updates packaged skill files and leaves unrelated files intact.
Before overwriting any changed file, the installer saves its original under
`.apaper-backups/<unique-install-id>/`, retaining its relative path. Identical
files are skipped. Backups may contain the same credentials as the original
configs. Invalid configs, ambiguous OpenCode configs (both JSON and JSONC present),
and symlink destinations are rejected before target files are changed.

Restart the client in your paper repository after installation. Claude Code
may ask for project MCP approval; Codex loads project MCP config only for trusted
repositories. Review the client's MCP list and skill list to confirm discovery.

These locations and formats follow the official documentation:
[Claude Code MCP](https://code.claude.com/docs/en/mcp),
[Claude Code skills](https://code.claude.com/docs/en/skills),
[Codex MCP](https://developers.openai.com/codex/mcp/),
[Codex skills](https://developers.openai.com/codex/skills/),
[OpenCode MCP](https://opencode.ai/docs/mcp-servers/), and
[OpenCode skills](https://opencode.ai/docs/skills/).

## Manual installation and other clients

[`mcp/`](mcp/) contains ready-to-merge client configuration examples. Copy the
two folders under [`skills/`](skills/) into your client's supported skill
directory, keeping each folder's `SKILL.md` and supporting files together.
Any client supporting stdio MCP can launch `uvx` with arguments `["apaper-mcp"]`.

This replaces the native DeepSeek Harness/Cordis packaging. The `./dsh` export,
DSH preset, and DSH runtime dependency are no longer shipped. Existing DSH users
can keep their previous release or configure the MCP server and skills through
their client's supported interfaces; `install.sh` targets the three clients above.

To remove an installation, delete only the `apaper-mcp` entry and the two copied
skill directories from the paths above. Shared `.agents/skills` serve both Codex
and OpenCode. Restore any locally customized files from `.apaper-backups` as needed.

## Development and publishing

Use Node.js 24+ for the TypeScript tests:

```bash
npm ci
npm run typecheck
npm test
npm run pack:check
```

The npm package ships the installer, MCP templates, and skills. Release publishing
uses npm trusted publishing through GitHub OIDC. See
[`prompt/release.md`](prompt/release.md) for the release process.

## License

MIT. See [LICENSE](LICENSE).
