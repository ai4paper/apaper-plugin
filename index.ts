import type { Plugin } from "@opencode-ai/plugin";
import { fileURLToPath } from "node:url";

const skillsPath = fileURLToPath(new URL("../skills", import.meta.url));

type ConfigWithSkills = {
  skills?: {
    paths?: string[];
  };
};

const ApaperPlugin: Plugin = async () => {
  return {
    async config(config) {
      // The runtime config supports skills.paths, but SDK 1.18.13 omits it.
      const pluginConfig = config as typeof config & ConfigWithSkills;
      pluginConfig.skills ??= {};
      pluginConfig.skills.paths ??= [];
      if (!pluginConfig.skills.paths.includes(skillsPath)) {
        pluginConfig.skills.paths.push(skillsPath);
      }

      config.mcp ??= {};
      config.mcp["apaper-mcp"] ??= {
        type: "local",
        command: ["uvx", "apaper-mcp"],
        enabled: true,
      };
    },
  };
};

export default ApaperPlugin;
