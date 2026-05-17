import {
    AiErrorInfoType,
    AiProviderError,
} from "@/features/translator/utils/errors";

import {
    assertCompletedOpenAiResponse,
    buildQuery,
    extractOpenAiText,
    isOpenAiErrorResponse,
    isOpenAiGenerateContentResponse,
    parseOpenAIJson,
} from "./openaiUtils";

import { AiMessage, AiProvider } from "../types";

export class OpenAiProvider implements AiProvider {
    constructor(private readonly apiKey: string) {}

    async fetch(messages: readonly AiMessage[]): Promise<string> {
        const { input, instructions } = buildQuery(messages);

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-5.4-mini",
                input,
                instructions,
                store: false,
            }),
        });

        const result = await parseOpenAIJson(response);

        if (!response.ok) {
            const errorBody = isOpenAiErrorResponse(result) ? result : null;
            const message =
                errorBody?.error.message ??
                response.statusText ??
                "Unknown error";

            const errorInfo: AiErrorInfoType = {
                provider: "openai",
                retryable: response.status >= 500,
                message: `OpenAI API error ${response.status}: ${message}`,
                status: response.status,
            };

            throw new AiProviderError(errorInfo);
        }

        if (!isOpenAiGenerateContentResponse(result)) {
            const errorInfo: AiErrorInfoType = {
                provider: "openai",
                retryable: false,
                message: `UNEXPECTED_OPENAI_RESPONSE_FORMAT`,
                status: response.status,
            };

            throw new AiProviderError(errorInfo);
        }

        assertCompletedOpenAiResponse(result);

        return extractOpenAiText(result, response.status);
    }
}
