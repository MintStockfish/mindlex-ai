import { AiMessage, AiProvider } from "./types";

const CLOUDFLARE_MODEL = "@cf/openai/gpt-oss-120b" as const;

type CloudflareOutput =
    AiModels[typeof CLOUDFLARE_MODEL]["postProcessedOutputs"];

export function extractCloudflareText(result: CloudflareOutput): string {
    if ("output_text" in result && typeof result.output_text === "string") {
        return result.output_text;
    }

    if ("output" in result && Array.isArray(result.output)) {
        const text = result.output
            .find((item) => item.type === "message")
            ?.content.find((part) => part.type === "output_text")?.text;

        if (text) return text;
    }

    if ("choices" in result) {
        const text = result.choices?.[0]?.message.content;

        if (text) return text;
    }

    throw new Error("UNEXPECTED_AI_RESPONSE_FORMAT");
}

export class CloudflareProvider implements AiProvider {
    constructor(private readonly env: CloudflareEnv) {}

    public async fetch(messages: readonly AiMessage[]): Promise<string> {
        const result = await this.env.AI.run(CLOUDFLARE_MODEL, {
            input: [...messages],
        });
        return extractCloudflareText(result);
    }
}
