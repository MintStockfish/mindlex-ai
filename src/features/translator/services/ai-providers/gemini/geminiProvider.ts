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

            throw new Error(
                `Gemini API error ${response.status}${status}: ${message}`,
            );
        }

        if (!isGeminiGenerateContentResponse(data)) {
            throw new Error("UNEXPECTED_GEMINI_RESPONSE_FORMAT");
        }

        return extractGeminiText(data);
    }
}
