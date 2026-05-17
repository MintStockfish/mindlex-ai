import { z } from "zod";

import {
    SentenceDataSchema,
    WordDataSchema,
} from "@/features/translator/validations/schemas";

import { AiOutputParseError, ValidationError } from "./errors";
import {
    createSentenceSystemPrompt,
    createWordSystemPrompt,
} from "./promptUtils";

import { SentenceData, WordData } from "@/features/translator/types/types";

function createFallback(word: string): WordData {
    return {
        word: word,
        languageCode: "en",
        translation: "Translation unavailable",
        exampleSentence: "Unavailable",
        exampleTranslation: "Unavailable",
        ipa: "/",
        pronunciation: "unavailable",
        partsOfSpeech: [
            {
                type: "Unknown",
                meaning: "Service temporarily unavailable",
                example: "",
            },
        ],
        synonyms: [],
        antonyms: [],
        usage: { informal: 0, neutral: 0, formal: 0 },
        etymology: "Service unavailable",
    };
}

function cleanAiResponse(text: string): string {
    const regex = /```\s*(?:json)?\s*([\s\S]*?)\s*```/gi;
    const match = regex.exec(text);

    if (match) {
        return match[1].trim();
    }

    return text.trim();
}

function parseAiResponse<T>(
    rawInput: unknown,
    schema: z.ZodSchema<T>,
    errorName: string,
): T {
    let jsonString: string;

    if (typeof rawInput === "string") {
        jsonString = cleanAiResponse(rawInput);
    } else if (typeof rawInput === "object" && rawInput !== null) {
        jsonString = JSON.stringify(rawInput);
    } else {
        throw new AiOutputParseError("UNEXPECTED_AI_RESPONSE_FORMAT");
    }

    let rawObject: unknown;
    try {
        rawObject = JSON.parse(jsonString);
    } catch {
        console.error(`JSON Parse failed on (${errorName}):`, jsonString);
        throw new AiOutputParseError(
            `INVALID_JSON_FORMAT_${errorName.toUpperCase()}`,
        );
    }

    if (
        rawObject &&
        typeof rawObject === "object" &&
        "error" in rawObject &&
        rawObject.error === "INVALID_INPUT"
    ) {
        throw new AiOutputParseError("INVALID_INPUT_DETECTED", false);
    }

    try {
        return schema.parse(rawObject);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error(`Zod Validation Error (${errorName}):`, error.issues);
        }
        throw new AiOutputParseError(
            `INVALID_JSON_FORMAT_${errorName.toUpperCase()}`,
        );
    }
}

function parseData(
    rawInput: string,
    type: "word" | "sentence",
): WordData | SentenceData {
    if (type === "word") {
        return parseAiResponse(rawInput, WordDataSchema, "Word");
    }
    return parseAiResponse(rawInput, SentenceDataSchema, "Sentence");
}

export const ChatRequestSchema = z
    .object({
        prompt: z.string().optional(),
        word: z.string().optional(),

        sourceLang: z.string().default("English"),
        targetLang: z.string().default("Russian"),
        mode: z.enum(["word", "sentence"]).default("word"),
        provider: z.string().default(""),
        apiKey: z.string().default("").optional(),
    })
    .transform((data) => {
        const userWord = (data.prompt || data.word || "").trim();
        return {
            ...data,
            userWord,
        };
    })
    .refine((data) => data.userWord.length > 0, {
        message: "Word/Sentence is required",
        path: ["word"],
    });

type ChatRequest = z.infer<typeof ChatRequestSchema>;

function prepareTranslationRequest(body: unknown) {
    const result = ChatRequestSchema.safeParse(body);

    if (!result.success) {
        const errorMessage = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");
        throw new ValidationError(errorMessage);
    }

    const data = result.data;

    const systemPrompt =
        data.mode === "sentence"
            ? createSentenceSystemPrompt(data.sourceLang, data.targetLang)
            : createWordSystemPrompt(data.sourceLang, data.targetLang);

    const messages = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content:
                data.mode === "sentence"
                    ? data.userWord
                    : data.userWord.toLowerCase(),
        },
    ] as const;

    return {
        userWord: data.userWord,
        mode: data.mode,
        messages,
        provider: data.provider,
        apiKey: data?.apiKey,
    };
}

export {
    type ChatRequest,
    cleanAiResponse,
    createFallback,
    parseAiResponse,
    parseData,
    prepareTranslationRequest,
};
