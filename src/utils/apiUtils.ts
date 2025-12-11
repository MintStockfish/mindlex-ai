import { WordData } from "@/types/translatorTypes";
import { WordDataSchema } from "@/validations/aiResponse";
import { z } from "zod";

function createSystemPrompt(sourceLang: string = "English", targetLang: string = "Russian") {
    return `
        You are a strict linguistic API that outputs ONLY valid JSON.
        Your task: Analyze the provided ${sourceLang} word and translate it to ${targetLang}.

        LANGUAGE RULES:
        - "word": The original word (in ${sourceLang})
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
        1. Output RAW JSON only. Do NOT use Markdown code blocks (no \`\`\`json).
        2. Do NOT add any conversational text, explanations, or preambles.
        3. Use double quotes for all JSON keys and values.
        4. Ensure the JSON is valid RFC 8259.
        5. CRITICAL: If the word acts as multiple parts of speech, include entries for ALL common parts of speech.

        SCHEMA EXAMPLE (for English->Russian):
        {
        "word": "water",
        "translation": "вода",
        "exampleSentence": "Can you give me some water?",
        "exampleTranslation": "Ты можешь дать мне воды?",
        "ipa": "/ˈwɔːtər/",
        "pronunciation": "уо́тэр",
        "partsOfSpeech": [
            { "type": "Существительное", "meaning": "Прозрачная жидкость без цвета и запаха", "example": "Glass of water" },
            { "type": "Глагол", "meaning": "Поливать растения", "example": "I need to water the flowers" }
        ],
        "synonyms": [
            { "word": "liquid", "ipa": "/ˈlɪkwɪd/" }
        ],
        "antonyms": [
            { "word": "drought", "ipa": "/draʊt/" }
        ],
        "usage": { "informal": 10, "neutral": 80, "formal": 10 },
        "etymology": "От протоиндоевропейского *wódr̥. Любопытно, что в древности это слово обозначало 'неодушевленную' воду (как вещество), в отличие от 'ap-', которое могло означать живую, текущую воду (сравни с рекой)."
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
