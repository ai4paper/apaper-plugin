import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  apply,
  type DshPluginContext,
  registerPackagedSkills,
} from "../dsh/index.js";

test("exposes only the DeepSeek Harness plugin entrypoint", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(manifest.exports, {
    "./dsh": {
      types: "./dsh/index.d.ts",
      import: "./dsh/index.js",
    },
  });
});

test("registers the packaged DSH skills", async () => {
  const registered: Array<Record<string, unknown>> = [];
  await registerPackagedSkills({
    skills: {
      register(skill) {
        registered.push(skill as unknown as Record<string, unknown>);
        return () => {};
      },
    },
  });

  await access(
    new URL("../dsh/preset-example/agent.cordis.fragment.yml", import.meta.url),
  );
  await access(new URL("../dsh/preset-example/preset.yml", import.meta.url));

  assert.deepEqual(
    registered.map(({ name }) => name),
    ["writing", "creating-figures"],
  );
  for (const skill of registered) {
    assert.equal(skill.source, "bundled");
    assert.equal(skill.provider, "apaper-plugin");
    assert.equal(typeof skill.content, "string");
    assert.ok((skill.content as string).startsWith("# "));
    await access(skill.path as string);
  }
});

test("connects apaper-mcp through the DSH MCP client", async () => {
  const registered: string[] = [];
  let mcpConfig: unknown;
  let startupAwaited = false;

  const ctx: DshPluginContext = {
    skills: {
      register(skill) {
        registered.push(skill.name);
        return () => {};
      },
    },
    tools: {},
    root: {},
    plugin(_plugin, config) {
      mcpConfig = config;
      return {
        async await() {
          startupAwaited = true;
        },
      };
    },
  };

  await apply(ctx);

  assert.deepEqual(registered, ["writing", "creating-figures"]);
  assert.equal(startupAwaited, true);
  assert.deepEqual(mcpConfig, {
    serverName: "apaper-mcp-v2-1",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@ai4paper/apaper-mcp"],
    failOnStartupError: true,
  });
});
