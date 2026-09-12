#!/usr/bin/env bash
set -euo pipefail

# Keep the complete program in a function so curl | bash finishes reading it
# before a child process can consume stdin.
apaper_install() {
  for arg in "$@"; do
    if [[ "$arg" == "--help" || "$arg" == "-h" ]]; then
      cat <<'HELP'
Install APaper MCP configuration and skills into a repository.

Usage: bash install.sh [--client CLIENT[,CLIENT...]] [--only all|skills|mcps] [--repo PATH]
Clients: claude-code (aliases: claude, claudecode), codex, opencode, all
Repeat --client or use commas to select multiple clients.
Omitted options are prompted in a terminal. Defaults: codex, all components,
and the current directory. Non-interactive use requires --repo.
Custom MCP entries are preserved; the old default
npx launcher migrates to uvx. Changed files
are backed up under <repo>/.apaper-backups/.

A standalone script downloads the toolkit from GitHub into a temporary
folder and removes it after installation. APAPER_REF selects a branch, tag,
or commit (default: main). A complete local checkout uses its own files.
Installer: Node.js 20+, npm, Bash, and (for downloads) curl and tar.
MCP server: uv/uvx and Python 3.12+.
HELP
      return
    fi
  done

  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "The APaper installer requires Node.js 20+ and npm." >&2
    return 1
  fi
  node -e 'if (Number(process.versions.node.split(".")[0]) < 20) { console.error("APaper requires Node.js 20+."); process.exit(1); }'

  local toolkit_dir="" script_path="${BASH_SOURCE[0]:-}"
  if [[ -n "$script_path" && -f "$script_path" ]]; then
    toolkit_dir="$(cd -- "$(dirname -- "$script_path")" && pwd)"
  fi
  if [[ -z "$toolkit_dir" || ! -f "$toolkit_dir/scripts/install.mjs" || ! -d "$toolkit_dir/skills" || ! -d "$toolkit_dir/mcp" || ! -f "$toolkit_dir/package.json" ]]; then
    if ! command -v curl >/dev/null 2>&1 || ! command -v tar >/dev/null 2>&1; then
      echo "APaper online installation requires curl and tar." >&2
      return 1
    fi
    # This variable remains available to the EXIT trap after the function returns.
    apaper_download_dir="$(mktemp -d "${TMPDIR:-/tmp}/apaper-install.XXXXXXXX")"
    trap 'rm -rf -- "$apaper_download_dir"' EXIT
    trap 'exit 130' INT
    trap 'exit 143' TERM
    local ref="${APAPER_REF:-main}" archive_ref
    archive_ref="$(node -p 'encodeURIComponent(process.argv[1])' "$ref")"
    echo "Downloading APaper tools from GitHub ($ref)..."
    curl --fail --location --silent --show-error --retry 3 --connect-timeout 15 --max-time 120 \
      "https://codeload.github.com/ai4paper/apaper-plugin/tar.gz/$archive_ref" \
      --output "$apaper_download_dir/toolkit.tar.gz"
    toolkit_dir="$apaper_download_dir/toolkit"
    mkdir -- "$toolkit_dir"
    tar -xzf "$apaper_download_dir/toolkit.tar.gz" --strip-components=1 -C "$toolkit_dir"
    if [[ ! -f "$toolkit_dir/scripts/install.mjs" || ! -d "$toolkit_dir/skills" || ! -d "$toolkit_dir/mcp" || ! -f "$toolkit_dir/package.json" ]]; then
      echo "APaper: $ref does not contain the repository installer. Choose a newer APAPER_REF." >&2
      return 1
    fi
  fi

  # Dependencies belong to the toolkit, never to the target paper repository.
  if ! (cd -- "$toolkit_dir" && node --input-type=module -e 'await import("jsonc-parser"); await import("smol-toml")' >/dev/null 2>&1); then
    if [[ -f "$toolkit_dir/package-lock.json" ]]; then
      npm ci --prefix "$toolkit_dir" --omit=dev --ignore-scripts --no-audit --no-fund
    else
      npm install --prefix "$toolkit_dir" --omit=dev --ignore-scripts --no-audit --no-fund
    fi
  fi

  # A piped script occupies stdin; use the terminal for the interactive picker.
  # Do not exec: the shell must run its temporary-directory cleanup trap.
  if [[ ! -t 0 ]] && ( : </dev/tty ) 2>/dev/null; then
    node "$toolkit_dir/scripts/install.mjs" "$@" </dev/tty
  else
    node "$toolkit_dir/scripts/install.mjs" "$@"
  fi
}

apaper_install "$@"
