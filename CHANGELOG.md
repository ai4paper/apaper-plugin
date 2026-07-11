# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- OpenCode: Added OCX support — `registry.jsonc` manifest exposing `writing`, `creating-figures`, `apaper-mcp`, and the all-in-one `apaper` bundle; `scripts/build-registry.sh` stages root `skills/` into the OCX layout and builds with `ocx build`; `.github/workflows/registry.yml` publishes the registry to GitHub Pages; release tooling now also guards the `registry.jsonc` version. Install with `ocx registry add https://ai4paper.github.io/apaper-plugin --name apaper && ocx add apaper/apaper`. (@isomoes)

## [0.1.3] - 2026-07-01

- Skills: Added `THEOREMS.md` to the writing skill — guidance for polishing formal theorem, lemma, and proposition statements (eight statement rules, existence-first ordering, theorem-specific LaTeX notation, a worked before/after example, and a reusable polishing prompt), wired into the router and cross-linked from the other rule files. (@isomoes) 261cfcb
- Skills: Renamed `ieee-journal-writing` to `writing` and split its single `SKILL.md` into a router plus `PRINCIPLES.md` (always-on prose rules), `JOURNAL.md` (IEEE/journal style, section templates, structure checks), and `LATEX.md` (LaTeX/BibTeX conventions). The skill now covers general academic writing and applies the journal rules when the work targets a journal or IEEE-style manuscript. (@isomoes) 9f544fa
- Docs: Reframed the README around AI coding agents generally and added an "Install for Codex" section (skills via the `npx skills` CLI, apaper-mcp via `~/.codex/config.toml`), splitting the Claude Code and Codex install paths. (@isomoes) f0d14d0

## [0.1.2] - 2026-06-08

- Skills: Removed the `pdf` skill. Claude Code's Read tool now reads PDFs natively with page-range support (`pages` parameter, up to 20 pages per request), making the bundled extraction toolkit redundant for the plugin's read-the-paper workflow. (@isomoes) c6ad657

## [0.1.1] - 2026-05-15

- Release: Added tag-driven GitHub Actions release workflow and `prompt/release.md` documenting the release flow. (@isomoes) 6f92525
- Marketplace: Added .claude-plugin/marketplace.json so the repo can be installed via `/plugin marketplace add ai4paper/apaper-plugin`. (@isomoes) 5d8c55e
- Skills: Dropped find-skills and isomoes-writing wrappers; rely on upstream isomoes/skills instead. (@isomoes) 3a9ea30
- Plugin: Scaffolded apaper-plugin with manifest, .mcp.json for @ai4paper/apaper-mcp, and writing/figure/PDF skills from isomoes/skills. (@isomoes) 6e122d1
