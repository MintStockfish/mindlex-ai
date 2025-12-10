import { WordData } from "@/types/translatorTypes";
import { WordDataSchema } from "@/validations/aiResponse";
import { z } from "zod";

function createSystemPrompt() {
    return `
        You are a strict linguistic API that outputs ONLY valid JSON.
        Your task: Analyze the provided English word and return a JSON object strictly following the schema below.

        RULES:
        1. Output RAW JSON only. Do NOT use Markdown code blocks (no \`\`\`json).
        2. Do NOT add any conversational text, explanations, or preambles.
        3. Use double quotes for all JSON keys and values.
        4. Ensure the JSON is valid RFC 8259.
        5. CRITICAL: If the word acts as multiple parts of speech (e.g., "water" is both a Noun and a Verb), you MUST include entries for ALL common parts of speech in the "partsOfSpeech" array.

        SCHEMA EXAMPLE:
        {
        "word": "water",
        "translation": "вода",
        "exampleSentence": "Can you give me some water?",
        "exampleTranslation": "Ты можешь дать мне воды?",
        "ipa": "/ˈwɔːtər/",
        "pronunciation": "уо́тэр",
        "partsOfSpeech": [
            { "type": "Noun", "meaning": "Прозрачная жидкость без цвета и запаха", "example": "Glass of water" },
            { "type": "Verb", "meaning": "Поливать растения", "example": "I need to water the flowers" }
        ],
        "synonyms": [
            { "word": "liquid", "ipa": "/ˈlɪkwɪd/" },
            { "word": "irrigate", "ipa": "/ˈɪrɪɡeɪt/" }
        ],
        "antonyms": [
            { "word": "drought", "ipa": "/draʊt/" }
        ],
        "usage": { "informal": 10, "neutral": 80, "formal": 10 },
        "etymology": "From Old English wæter..."
        }
    `;
}

function createFallback(word: string): WordData {
    return {
        word: word,
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

function parseWordData(rawInput: unknown): WordData {
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

        const validatedData = WordDataSchema.parse(rawObject);

        return validatedData as WordData;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.issues);
        } else {
            console.error("JSON Parse failed on:", jsonString);
        }
        throw new Error("INVALID_JSON_FORMAT");
    }
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
    createSystemPrompt,
    cleanAiResponse,
    createFallback,
    parseWordData,
    fetchRawAiResponse,
};
