import { CloudflareProvider } from "./ai-providers/cloudflareProvider";
import { GeminiProvider } from "./ai-providers/geminiProvider";

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
    }

    // The chatgpt implementation some day will appear here for sure.

    return new CloudflareProvider(env);
}
