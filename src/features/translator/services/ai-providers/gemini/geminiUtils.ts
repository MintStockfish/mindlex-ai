import { isRecord } from "../utils";
import {
    GeminiContentRole,
    GeminiErrorResponse,
    GeminiGenerateContentRequest,
    GeminiGenerateContentResponse,
} from "./geminiTypes";

import { AiMessage } from "../types";

export function isGeminiErrorResponse(
    value: unknown,
): value is GeminiErrorResponse {
    if (!isRecord(value) || !isRecord(value.error)) return false;

    return (
        typeof value.error.code === "number" &&
        typeof value.error.message === "string" &&
        typeof value.error.status === "string"
    );
}

export function isGeminiGenerateContentResponse(
    value: unknown,
): value is GeminiGenerateContentResponse {
    if (!isRecord(value)) return false;

    if ("candidates" in value && !Array.isArray(value.candidates)) {
        return false;
    }

    return (
        "candidates" in value ||
        "promptFeedback" in value ||
        "usageMetadata" in value ||
        "modelVersion" in value ||
        "responseId" in value
    );
}

export async function parseGeminiJson(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch (parseErr) {
        throw new Error(
            `Failed to parse JSON from Gemini: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}`,
        );
    }
}

function toGeminiContentRole(role: AiMessage["role"]): GeminiContentRole {
    return role === "assistant" ? "model" : "user";
}

export function buildGeminiRequest(
    messages: readonly AiMessage[],
): GeminiGenerateContentRequest {
    return {
        contents: messages.map((msg) => ({
            role: toGeminiContentRole(msg.role),
            parts: [{ text: msg.content }],
        })),
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
        },
    };
}

export function extractGeminiText(data: GeminiGenerateContentResponse): string {
    const candidate = data.candidates?.[0];
    if (!candidate) {
        const blockReason = data.promptFeedback?.blockReason;
        throw new Error(
            blockReason
                ? `No candidates returned from Gemini: ${blockReason}`
                : "No candidates returned from Gemini",
        );
    }

    const text = candidate.content?.parts
        .map((part) => part.text ?? "")
        .join("")
        .trim();

    if (!text) {
        throw new Error("No text content in Gemini response");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
        console.warn(`Generation stopped early: ${candidate.finishReason}`);
    }

    return text;
}
