import type { Config, PluginInput } from "@opencode-ai/plugin";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

import plugin from "../dist/index.js";
import { registerPackagedSkills } from "../dsh/index.js";

const expectedSkillsPath = fileURLToPath(new URL("../skills", import.meta.url));

test("exposes an OpenCode server entrypoint", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(manifest.exports["./server"], {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
  });
});

test("exposes a DeepSeek Harness entrypoint", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(manifest.exports["./dsh"], {
    types: "./dsh/index.d.ts",
    import: "./dsh/index.js",
  });

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

test("registers packaged skills and the Python MCP server", async () => {
  const hooks = await plugin({} as PluginInput);
  assert.ok(hooks.config);

  const config = {};
  await hooks.config(config as Config);

  assert.deepEqual(config, {
    skills: { paths: [expectedSkillsPath] },
    mcp: {
      "apaper-mcp": {
        type: "local",
        command: ["uvx", "apaper-mcp"],
        enabled: true,
      },
    },
  });
  await access(new URL("../skills/writing/SKILL.md", import.meta.url));
  await access(new URL("../skills/creating-figures/SKILL.md", import.meta.url));
});

test("does not duplicate the packaged skill path", async () => {
  const hooks = await plugin({} as PluginInput);
  assert.ok(hooks.config);

  const config = { skills: { paths: [expectedSkillsPath] } };
  await hooks.config(config as Config);

  assert.deepEqual(config.skills.paths, [expectedSkillsPath]);
});

test("preserves an existing MCP configuration", async () => {
  const hooks = await plugin({} as PluginInput);
  assert.ok(hooks.config);

  const existing = {
    type: "local" as const,
    command: ["custom-apaper-mcp"],
    enabled: false,
  };
  const config = { mcp: { "apaper-mcp": existing } };
  await hooks.config(config as Config);

  assert.equal(config.mcp["apaper-mcp"], existing);
});
