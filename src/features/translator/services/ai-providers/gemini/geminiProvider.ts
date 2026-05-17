import {
    AiErrorInfoType,
    AiProviderError,
} from "@/features/translator/utils/errors";

import {
    buildGeminiRequest,
    extractGeminiText,
    isGeminiErrorResponse,
    isGeminiGenerateContentResponse,
    parseGeminiJson,
} from "./geminiUtils";

import { AiMessage, AiProvider } from "../types";

const GEMINI_MODEL = "gemini-3.1-flash-lite";

export class GeminiProvider implements AiProvider {
    constructor(private readonly apiKey: string) {}

    async fetch(messages: readonly AiMessage[]): Promise<string> {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
                method: "POST",
                headers: {
                    "x-goog-api-key": this.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(buildGeminiRequest(messages)),
            },
        );

        const data = await parseGeminiJson(response);

        if (!response.ok) {
            const errorBody = isGeminiErrorResponse(data) ? data : null;

            const status = errorBody ? ` ${errorBody.error.status}` : "";
            const message =
                errorBody?.error.message ??
                response.statusText ??
                "Unknown error";

            const errorInfo: AiErrorInfoType = {
                provider: "gemini",
                retryable: response.status >= 500,
                message: `Gemini API error ${response.status}${status}: ${message}`,
                status: response.status,
            };

            throw new AiProviderError(errorInfo);
        }

        if (!isGeminiGenerateContentResponse(data)) {
            const errorInfo: AiErrorInfoType = {
                provider: "gemini",
                retryable: false,
                message: "UNEXPECTED_GEMINI_RESPONSE_FORMAT",
                status: response.status,
            };

            throw new AiProviderError(errorInfo);
        }

        return extractGeminiText(data);
    }
}
