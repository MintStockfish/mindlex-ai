export const CLOUDFLARE_MODEL = "@cf/openai/gpt-oss-120b" as const;

export type CloudflareOutput =
    AiModels[typeof CLOUDFLARE_MODEL]["postProcessedOutputs"];
