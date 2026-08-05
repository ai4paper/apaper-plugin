# Release Prompt

Use this prompt when preparing a release for `apaper-plugin`. Pushing a
`v*` tag triggers `.github/workflows/publish.yml`, which verifies the version
files and publishes the OpenCode plugin to npm. A successful publish then
triggers `.github/workflows/release.yml` to create the GitHub Release from
`CHANGELOG.md`.

## First npm publish

The package must exist on npm before trusted publishing can be configured.
Publish the first version manually:

```bash
npm login
npm ci
npm run typecheck
npm test
npm run pack:check
npm publish --access public
```

Then open the `@ai4paper/apaper-plugin` package settings on npmjs.com and add
a trusted publisher with:

```text
Repository:  ai4paper/apaper-plugin
Workflow:    .github/workflows/publish.yml
Environment: (leave blank)
```

Future tag releases use GitHub OIDC and require no `NPM_TOKEN` secret.

## Prompt

```md
Prepare a release for `ai4paper/apaper-plugin`.

Release target: `v<version>`
Release date: `<YYYY-MM-DD>`
GitHub username for changelog attribution: `@<username>`

Do the following in order:

1. Update `CHANGELOG.md`:
   - keep a fresh empty `## [Unreleased]` section at the top
   - rename the previous `## [Unreleased]` heading to `## [<version>] - <YYYY-MM-DD>`
   - keep each bullet ending with `(@<username>) <short-sha>`, matching the
     existing ipaper-style format
   - the `## [<version>] - <YYYY-MM-DD>` block becomes the GitHub Release
     body, so trim it to release-worthy bullets

2. Bump the plugin version to `<version>` in all three manifests:
   - `.claude-plugin/plugin.json` → `version`
   - `.claude-plugin/marketplace.json` → the `apaper-plugin` entry under
     `plugins[].version`
   - `package.json` → top-level `version` (OpenCode npm plugin)
   The release workflow refuses to publish if any of these disagrees
   with the tag.

3. Stage and commit the changes with a release-style message such as
   `release: v<version>`. Do NOT create the tag in the same commit.

4. Create an annotated tag pointing at the release commit:
   `git tag -a v<version> -m "Release v<version>"`

5. Push the commit and the tag together:
   `git push origin main v<version>`
   The tag push triggers `.github/workflows/publish.yml`, which:
     - verifies `plugin.json`, `marketplace.json`, and `package.json`
       versions match the tag
     - tests and publishes `@ai4paper/apaper-plugin` to npm
   A successful publish triggers `.github/workflows/release.yml`, which:
     - extracts the matching `## [<version>]` block from `CHANGELOG.md`
     - creates a GitHub Release named `Release v<version>` with that body

6. Verify on GitHub:
   - both the Publish and Release workflow runs are green
   - the release shows up under `Releases` with the expected notes
   - `@ai4paper/apaper-plugin@<version>` is available on npm

7. Report:
   - the version released
   - the release commit hash
   - the tag name
   - the workflow run URL, npm package URL, and release URL

If the workflow fails on the version check, fix the manifests, retag with
`git tag -fa v<version>` + `git push -f origin v<version>`, and rerun.
Otherwise, do not force-push tags.
```

## Manual fallback

If the workflow is unavailable, publish the npm package and create the release
locally with:

```bash
npm test
npm publish --access public

gh release create v<version> \
  --title "Release v<version>" \
  --notes-file <(awk -v v="<version>" '
    $0 ~ "^## \\[" v "\\]" { p=1; next }
    p && /^## \[/ { exit }
    p { print }
  ' CHANGELOG.md)
```
