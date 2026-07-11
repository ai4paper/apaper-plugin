#!/usr/bin/env bash
# Build the OCX registry for this repo.
#
# `ocx build` expects component sources under files/ next to registry.jsonc,
# but this repo keeps skills/ at the root so the same files also serve the
# Claude Code plugin. This script stages the expected layout in a temp
# directory and builds into dist/ (or $1 if given).
#
# Requires bun (https://bun.sh); ocx is fetched on demand via `bunx ocx`.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
out_dir="${1:-$repo_root/dist}"

staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT

cp "$repo_root/registry.jsonc" "$staging/"
mkdir -p "$staging/files"
cp -R "$repo_root/skills" "$staging/files/skills"

bunx ocx build "$staging" --out "$out_dir"

echo "Registry built to $out_dir"
