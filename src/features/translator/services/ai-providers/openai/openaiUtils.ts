import { isRecord } from "../utils";
import {
    OpenAiContentPart,
    OpenAiErrorResponse,
    OpenAiOutputItem,
    OpenAiResponse,
} from "./openaiTypes";

import { AiMessage } from "../types";

export function buildQuery(messages: readonly AiMessage[]) {
    return { input: messages[1].content, instructions: messages[0].content };
}

export async function parseOpenAIJson(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        throw new Error(`Parsing JSON error: ${errorMessage}`);
    }
}

export function isOpenAiErrorResponse(
    value: unknown,
): value is OpenAiErrorResponse {
    if (!isRecord(value) || !isRecord(value.error)) return false;

    return (
        typeof value.error.message === "string" &&
        (!("type" in value.error) || typeof value.error.type === "string") &&
        (!("code" in value.error) ||
            typeof value.error.code === "string" ||
            value.error.code === null) &&
        (!("param" in value.error) ||
            typeof value.error.param === "string" ||
            value.error.param === null)
    );
}

export function isOpenAiGenerateContentResponse(
    value: unknown,
): value is OpenAiResponse {
    return (
        isRecord(value) &&
        typeof value.status === "string" &&
        Array.isArray(value.output) &&
        value.output.every(isOpenAiOutputItem) &&
        value.output.some(hasOpenAiOutputText)
    );
}

function isOpenAiOutputItem(value: unknown): value is OpenAiOutputItem {
    if (!isRecord(value) || typeof value.type !== "string") return false;

    if ("status" in value && typeof value.status !== "string") return false;
    if ("role" in value && typeof value.role !== "string") return false;

    if (value.type === "message") {
        return (
            Array.isArray(value.content) &&
            value.content.every(isOpenAiContentPart)
        );
    }

    return (
        !("content" in value) ||
        (Array.isArray(value.content) &&
            value.content.every(isOpenAiContentPart))
    );
}

function isOpenAiContentPart(value: unknown): value is OpenAiContentPart {
    if (!isRecord(value) || typeof value.type !== "string") return false;

    return !("text" in value) || typeof value.text === "string";
}

function hasOpenAiOutputText(item: OpenAiOutputItem): boolean {
    return (
        item.type === "message" &&
        item.content?.some(
            (part) => part.type === "output_text" && Boolean(part.text),
        ) === true
    );
}

export function extractOpenAiText(result: OpenAiResponse): string {
    const text = result.output
        .find((item) => item.type === "message")
        ?.content?.find((part) => part.type === "output_text")?.text;

    if (!text) {
        throw new Error("UNEXPECTED_OPENAI_RESPONSE_FORMAT");
    }

    return text.trim();
}

export function assertCompletedOpenAiResponse(result: OpenAiResponse): void {
    if (result.status !== "completed") {
        throw new Error(`OpenAI response was not completed: ${result.status}`);
    }
}
