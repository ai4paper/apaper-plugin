# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- Release: Added tag-driven GitHub Actions release workflow and `prompt/release.md` documenting the release flow. (@isomoes) 6f92525
- Marketplace: Added .claude-plugin/marketplace.json so the repo can be installed via `/plugin marketplace add ai4paper/apaper-plugin`. (@isomoes) 5d8c55e
- Skills: Dropped find-skills and isomoes-writing wrappers; rely on upstream isomoes/skills instead. (@isomoes) 3a9ea30
- Plugin: Scaffolded apaper-plugin with manifest, .mcp.json for @ai4paper/apaper-mcp, and writing/figure/PDF skills from isomoes/skills. (@isomoes) 6e122d1
