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

            throw new Error(`OpenAI API error ${response.status}: ${message}`);
        }

        if (!isOpenAiGenerateContentResponse(result)) {
            throw new Error("UNEXPECTED_OPENAI_RESPONSE_FORMAT");
        }

        assertCompletedOpenAiResponse(result);

        return extractOpenAiText(result);
    }
}
