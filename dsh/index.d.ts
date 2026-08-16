export interface DshSkillRegistry {
  register(skill: {
    name: string;
    description: string;
    content: string;
    source: "bundled";
    provider: string;
    resourceBase: { kind: "directory"; path: string };
    path: string;
  }): () => void;
}

export interface DshPluginFiber {
  await(): Promise<unknown>;
}

export interface DshPluginContext {
  skills: DshSkillRegistry;
  tools: unknown;
  root: object;
  plugin(plugin: unknown, config?: unknown): DshPluginFiber;
}

export declare const name = "apaper-plugin";
export declare const inject: readonly ["skills", "tools"];
export declare function registerPackagedSkills(
  ctx: Pick<DshPluginContext, "skills">,
): Promise<void>;
export declare function apply(ctx: DshPluginContext): Promise<void>;
