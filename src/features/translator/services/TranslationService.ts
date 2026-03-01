import {
    fetchRawAiResponse,
    withRetries,
} from "@/features/translator/utils/aiUtils";
import {
    type ChatRequest,
    parseSentenceData,
    parseWordData,
    prepareTranslationRequest,
} from "@/features/translator/utils/formatUtils";

import { AiServiceError } from "../utils/errors";

export class TransaltionService {
    constructor(private env: CloudflareEnv) {
        this.env = env;
    }

    async translate(body: ChatRequest) {
        const { userWord, messages, mode } = prepareTranslationRequest(body);

        try {
            return await withRetries(async () => {
                const rawResponse = await fetchRawAiResponse(
                    this.env,
                    messages,
                );
                return mode === "sentence"
                    ? parseSentenceData(rawResponse)
                    : parseWordData(rawResponse);
            }, 3);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            throw new AiServiceError(userWord, errorMessage);
        }
    }
}
