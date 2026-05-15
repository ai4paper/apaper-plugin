# Release Prompt

Use this prompt when preparing a release for `apaper-plugin`. Pushing a
`v*` tag triggers `.github/workflows/release.yml`, which verifies the
version files and creates a GitHub Release whose body is extracted from
`CHANGELOG.md`. The plugin itself is distributed via the marketplace
catalog (`.claude-plugin/marketplace.json`); there is no npm publish.

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

2. Bump the plugin version to `<version>` in both manifests:
   - `.claude-plugin/plugin.json` → `version`
   - `.claude-plugin/marketplace.json` → the `apaper-plugin` entry under
     `plugins[].version`
   The release workflow refuses to publish if either of these disagrees
   with the tag.

3. Stage and commit the changes with a release-style message such as
   `release: v<version>`. Do NOT create the tag in the same commit.

4. Create an annotated tag pointing at the release commit:
   `git tag -a v<version> -m "Release v<version>"`

5. Push the commit and the tag together:
   `git push origin main v<version>`
   The tag push triggers `.github/workflows/release.yml`, which:
     - verifies `plugin.json` and `marketplace.json` versions match the tag
     - extracts the matching `## [<version>]` block from `CHANGELOG.md`
     - creates a GitHub Release named `Release v<version>` with that body

6. Verify on GitHub:
   - the workflow run on the `Actions` tab is green
   - the release shows up under `Releases` with the expected notes

7. Report:
   - the version released
   - the release commit hash
   - the tag name
   - the workflow run URL and the release URL

If the workflow fails on the version check, fix the manifests, retag with
`git tag -fa v<version>` + `git push -f origin v<version>`, and rerun.
Otherwise, do not force-push tags.
```

## Manual fallback

If the workflow is unavailable, you can create the release locally with:

```bash
gh release create v<version> \
  --title "Release v<version>" \
  --notes-file <(awk -v v="<version>" '
    $0 ~ "^## \\[" v "\\]" { p=1; next }
    p && /^## \[/ { exit }
    p { print }
  ' CHANGELOG.md)
```
