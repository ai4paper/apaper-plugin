# APaper DeepSeek Harness preset example

DeepSeek Harness presets are complete agent compositions. To retain the normal
coding tools, start by copying the shipped **Standard** preset rather than using
the APaper row as a standalone preset.

1. Install `@ai4paper/apaper-plugin` into the DSH profile.
2. Open **Settings → Agent Presets** in the Harness GUI.
3. Copy **Standard** with the ID `apaper` and display name `APaper`.
4. Optionally use the supplied `preset.yml` as the copied preset's metadata.
5. Append the contents of `agent.cordis.fragment.yml` to the copied preset's
   `agent.cordis.yml`.
6. Create a new session and select the APaper preset.

The single APaper row registers the packaged `writing` and `creating-figures`
skills and starts `apaper-mcp` through the DSH MCP client. Do not replace the
complete copied Standard composition with the fragment: doing so would remove
its normal shell, filesystem, skill-loader, planning, and delegation tools.
