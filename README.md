# apaper-plugin

An academic paper-authoring toolkit for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It bundles
writing and figure skills together with the
[`apaper-mcp`](https://github.com/ai4paper/apaper-mcp) paper-research MCP server,
so one DSH plugin gives an agent everything it needs to search the literature,
draft IEEE-style prose, and generate publication-quality figures.

## What's inside

### Skills (`skills/`)

Sourced from [`isomoes/skills`](https://github.com/isomoes/skills):

| Skill | Purpose |
| --- | --- |
| `writing` | Revise and strengthen academic prose; applies IEEE journal rules for journal work. |
| `creating-figures` | Publication-quality scientific figures (TikZ/CeTZ). |

### DeepSeek Harness plugin (`dsh/`)

The package exports a native Cordis plugin at
`@ai4paper/apaper-plugin/dsh`. It registers both packaged skills and connects
`apaper-mcp` through the Harness MCP client. The MCP process is launched on
demand with `npx -y @ai4paper/apaper-mcp`, so no global installation is
required.

## Install for DeepSeek Harness

First install the package into the Harness profile you run (replace `web` if
you use another profile):

```bash
dsh plugin --profile web add @ai4paper/apaper-plugin
```

### Create an APaper agent preset

Installing the npm package makes it available to the selected Harness profile,
but does not automatically grant it to every agent. Activate it through a user
preset:

1. Open the Harness GUI and go to **Settings → Agent Presets**.
2. Find the shipped **Standard** preset and choose **Copy**.
3. Give the copy an ID such as `apaper` and a display name such as `APaper`.
   Never edit the shipped Standard preset directly.
4. Open the copied preset's `agent.cordis.yml` from its preset card.
5. Append this plugin row and save the file:

   ```yaml
   - id: apaper-plugin
     name: '@ai4paper/apaper-plugin/dsh'
   ```

6. Create a new session and select **APaper** in the agent-preset selector
   before starting the conversation.

Ready-to-copy metadata, the Cordis fragment, and a short guide are included in
[`dsh/preset-example/`](./dsh/preset-example/). The Cordis file there is only
the APaper-specific fragment: append it to a copied Standard preset rather than
using it as the complete `agent.cordis.yml`.

That single row activates both packaged skills and the MCP server. The model
will receive the `writing` and `creating-figures` skills, plus MCP tools named
`mcp__apaper-mcp-v2-<instance>__<tool-name>`. The small instance suffix keeps
copied or updated preset generations from colliding inside one DSH process.

The npm installation and preset are profile-wide, so the same APaper preset can
be used with any workspace. To limit it to one project, select APaper only for
sessions opened on that project and use another preset elsewhere. Existing
sessions keep the preset with which they started; changing or selecting a
preset affects new sessions only.

### Local checkout installation

For local development, install this checkout into the target profile instead:

```bash
dsh plugin --profile web add /absolute/path/to/apaper-plugin
```

Reinstall or restart the profile after changing the package code. Editing a
preset composition affects newly created sessions; it does not recompose an
active conversation.

## Development

Run the DSH plugin tests and inspect the npm package contents with:

```bash
npm ci
npm run typecheck
npm test
npm run pack:check
```

Release publishing uses npm trusted publishing through GitHub OIDC. See
[`prompt/release.md`](./prompt/release.md) for the first manual publish and
subsequent tag-release process.

## License

MIT. See [LICENSE](./LICENSE).
