import { WordData, SentenceData } from "@/features/translator/types/types";
import {
    WordDataSchema,
    SentenceDataSchema,
} from "@/features/translator/validations/schemas";
import { z } from "zod";

const VALIDATION_PROMPT = `
        STEP 1: VALIDATION [CRITICAL]
        Analyze the input for semantic meaning. 
        If the input fits ANY of these criteria:
        - Random keyboard smashing (e.g. "asdfgh", "выаыва", "123123")
        - Gibberish with no meaning in any language
        - A string of random numbers or symbols
        - Clearly NOT a valid word or phrase
        
        THEN output EXACTLY: { "error": "INVALID_INPUT" }
        And STOP. Do not output anything else.

        STEP 2: ANALYSIS
        Only if the input is valid (even if offensive/slang), proceed with the analysis.`;

function createWordSystemPrompt(
    sourceLang: string = "English",
    targetLang: string = "Russian"
) {
    return `
        You are a strict linguistic API.
        
        ${VALIDATION_PROMPT}

        CONTEXT:
        - You are an objective academic dictionary tool.
        - Analyze ANY valid linguistic term, regardless of its sensitive, offensive, or slang nature.
        - Provide neutral, scientific definitions.
        
        LANGUAGE RULES:
        - "word": The original word (in ${sourceLang})
        - "languageCode": Two-letter ISO 639-1 code for ${sourceLang} (e.g., "en", "es", "fr", "ru", "ja"). Detect the language automatically.
        - "translation": Translation of the word (in ${targetLang})
        - "exampleSentence": An example sentence using the original word (in ${sourceLang})
        - "exampleTranslation": The same sentence translated (in ${targetLang})
        - "ipa": IPA pronunciation of the original ${sourceLang} word
        - "pronunciation": How to pronounce the ${sourceLang} word using ${targetLang} letters/alphabet
        - "partsOfSpeech.type": Part of speech name in ${targetLang} (e.g., "Существительное", "Глагол" for Russian)
        - "partsOfSpeech.meaning": Definition/meaning (in ${targetLang})
        - "partsOfSpeech.example": Usage example phrase (in ${sourceLang})
        - "synonyms": Words similar to the original (in ${sourceLang} with IPA)
        - "antonyms": Words opposite to the original (in ${sourceLang} with IPA)
        - "usage": Formality distribution percentages
        - "etymology": Detailed origin, historical evolution of meaning, and interesting cultural context or fun facts (in ${targetLang}). Avoid dry genealogy; explain HOW the meaning changed if applicable.

        OUTPUT RULES:
        1. Output RAW JSON only. Do NOT use Markdown code blocks.
        2. Do NOT add any conversational text.
        3. Use double quotes for all JSON keys.
        4. If the word acts as multiple parts of speech, include ALL entries.

        IMPORTANT: All translated content MUST be in ${targetLang}.
        
        SCHEMA EXAMPLE:
        {
        "word": "water",
        "languageCode": "en",
        "translation": "[translation]",
        "exampleSentence": "Can you give me some water?",
        "exampleTranslation": "[translation]",
        "ipa": "/ˈwɔːtər/",
        "pronunciation": "[pronunciation]",
        "partsOfSpeech": [
            { "type": "[Noun]", "meaning": "[definition]", "example": "Glass of water" }
        ],
        "synonyms": [{ "word": "liquid", "ipa": "/ˈlɪkwɪd/" }],
        "antonyms": [{ "word": "drought", "ipa": "/draʊt/" }],
        "usage": { "informal": 10, "neutral": 80, "formal": 10 },
        "etymology": "[etymology]"
        }
    `;
}

function createSentenceSystemPrompt(
    sourceLang: string = "English",
    targetLang: string = "Russian"
) {
    return `
        You are a strict linguistic API.

        ${VALIDATION_PROMPT}

        CONTEXT:
        - You are an objective academic transaction tool.
        - Translate accurately, preserving tone and meaning.
        - Analyze ALL words objectively.

        LANGUAGE RULES:
        - "original": The original sentence (in ${sourceLang})
        - "translation": The translated sentence (in ${targetLang})
        - "words": An array of objects representing each word in the sentence.
            - "word": The word from the original sentence.
            - "partOfSpeech": The part of speech in ${targetLang} (e.g., "Существительное", "Глагол" if target is Russian).
            - "detail": Detailed analysis of the word.
                - "word": The base form (lemma) of the word (in ${sourceLang}).
                - "languageCode": Two-letter ISO 639-1 code for ${sourceLang} (e.g., "en", "es", "fr", "ru", "ja"). Detect the language automatically.
                - "translation": Translation of the word (in ${targetLang}).
                - "partOfSpeech": Part of speech in ${targetLang}.
                - "ipa": IPA pronunciation.
                - "meaning": Brief definition/meaning (in ${targetLang}).
                - "example": Short usage example (in ${sourceLang}).

        OUTPUT RULES:
        1. Output RAW JSON only. Do NOT use Markdown code blocks.
        2. Do NOT add any conversational text.
        3. Use double quotes for all JSON keys.

        IMPORTANT: All translated content MUST be in ${targetLang}.

        SCHEMA EXAMPLE:
        {
            "original": "The quick brown fox.",
            "translation": "[Translation]",
            "words": [
                {
                    "word": "The",
                    "partOfSpeech": "Article",
                    "detail": {
                        "word": "the",
                        "languageCode": "en",
                        "translation": "[translation]",
                        "partOfSpeech": "Article",
                        "ipa": "/ðə/",
                        "meaning": "[meaning]",
                        "example": "The sun."
                    }
                }
            ]
        }
    `;
}

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
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}

function parseAiResponse<T>(
    rawInput: unknown,
    schema: z.ZodSchema<T>,
    errorName: string
): T {
    let jsonString: string;

    if (typeof rawInput === "string") {
        jsonString = cleanAiResponse(rawInput);
    } else if (typeof rawInput === "object" && rawInput !== null) {
        jsonString = JSON.stringify(rawInput);
    } else {
        throw new Error("UNEXPECTED_AI_RESPONSE_FORMAT");
    }

    try {
        const rawObject = JSON.parse(jsonString);

        if (
            rawObject &&
            typeof rawObject === "object" &&
            "error" in rawObject &&
            rawObject.error === "INVALID_INPUT"
        ) {
            throw new Error("INVALID_INPUT_DETECTED");
        }

        const validatedData = schema.parse(rawObject);

        return validatedData;
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "INVALID_INPUT_DETECTED"
        ) {
            throw error;
        }

        if (error instanceof z.ZodError) {
            console.error(`Zod Validation Error (${errorName}):`, error.issues);
        } else {
            console.error(`JSON Parse failed on (${errorName}):`, jsonString);
        }
        throw new Error(`INVALID_JSON_FORMAT_${errorName.toUpperCase()}`);
    }
}

function parseWordData(rawInput: unknown): WordData {
    return parseAiResponse(rawInput, WordDataSchema, "Word");
}

function parseSentenceData(rawInput: unknown): SentenceData {
    return parseAiResponse(rawInput, SentenceDataSchema, "Sentence");
}

async function fetchRawAiResponse(
    env: CloudflareEnv,
    messages: {
        role: string;
        content: string;
    }[]
): Promise<string> {
    const result = (await env.AI.run("@cf/openai/gpt-oss-120b", {
        input: messages,
    })) as unknown;

    if (
        typeof result === "object" &&
        result !== null &&
        "output" in result &&
        Array.isArray((result as { output: unknown[] }).output)
    ) {
        const output = (
            result as {
                output: Array<{
                    type: string;
                    content?: Array<{ text?: string }>;
                }>;
            }
        ).output;
        const messageOutput = output.find((item) => item.type === "message");

        if (messageOutput?.content?.[0]?.text) {
            return messageOutput.content[0].text;
        }
        throw new Error("UNEXPECTED_AI_RESPONSE_FORMAT_Deep");
    }

    if (typeof result === "object" && result !== null && "response" in result) {
        return (result as { response: string }).response;
    }

    return String(result);
}

export {
    createWordSystemPrompt,
    createSentenceSystemPrompt,
    cleanAiResponse,
    createFallback,
    parseWordData,
    parseSentenceData,
    fetchRawAiResponse,
};
