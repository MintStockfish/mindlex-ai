import { OpenAiProvider } from "@/features/translator/services/ai-providers/openai/openaiProvider";

import { CloudflareProvider } from "./ai-providers/cloudflare/cloudflareProvider";
import { GeminiProvider } from "./ai-providers/gemini/geminiProvider";

import { AiProvider } from "./ai-providers/types";

type ProviderOptions = {
    provider: string;
    apiKey?: string;
};

export function createProvider(
    options: ProviderOptions,
    env: CloudflareEnv,
): AiProvider {
    if (options.provider === "gemini" && options.apiKey) {
        return new GeminiProvider(options.apiKey);
    } else if (options.provider === "openai" && options.apiKey) {
        return new OpenAiProvider(options.apiKey);
    }
    return new CloudflareProvider(env);
}
