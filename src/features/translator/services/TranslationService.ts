import { withRetries } from "@/features/translator/utils/aiUtils";
import {
    parseData,
    prepareTranslationRequest,
} from "@/features/translator/utils/formatUtils";

import { AiServiceError } from "../utils/errors";
import { createProvider } from "./AiProviderService";

export class TranslationService {
    constructor(private readonly env: CloudflareEnv) {}

    async translate(body: unknown) {
        const { userWord, messages, mode, provider, apiKey } =
            prepareTranslationRequest(body);

        try {
            const aiProvider = createProvider({ provider, apiKey }, this.env);

            return await withRetries(async () => {
                const rawResponse = await aiProvider.fetch(messages);

                return mode === "sentence"
                    ? parseData(rawResponse, "sentence")
                    : parseData(rawResponse, "word");
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            throw new AiServiceError(userWord, errorMessage);
        }
    }
}
