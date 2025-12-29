import { getCloudflareContext } from "@opennextjs/cloudflare";
import { WordData, SentenceData } from "@/features/translator/types/types";
import {
    createWordSystemPrompt,
    createSentenceSystemPrompt,
    parseWordData,
    parseSentenceData,
    createFallback,
    fetchRawAiResponse,
} from "@/features/translator/utils/apiUtils";

interface ChatRequest {
    prompt?: string;
    word?: string;
    sourceLang?: string;
    targetLang?: string;
    mode?: "word" | "sentence";
}

interface ChatResponse {
    success: boolean;
    data?: WordData | SentenceData;
    error?: string;
}

export async function POST(request: Request): Promise<Response> {
    let userWord = "";
    let mode: "word" | "sentence" = "word";

    try {
        const { env } = getCloudflareContext();
        const body: ChatRequest = await request.json();

        userWord = (body.prompt || body.word || "").trim();
        const sourceLang = body.sourceLang || "English";
        const targetLang = body.targetLang || "Russian";
        mode = body.mode || "word";

        if (!userWord) {
            return Response.json(
                { success: false, error: "Word/Sentence is required" },
                { status: 400 }
            );
        }

        const systemPrompt =
            mode === "sentence"
                ? createSentenceSystemPrompt(sourceLang, targetLang)
                : createWordSystemPrompt(sourceLang, targetLang);

        const messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content:
                    mode === "sentence" ? userWord : userWord.toLowerCase(),
            },
        ];

        const MAX_RETRIES = 3;
        let parsedData: WordData | SentenceData | null = null;
        let lastError: unknown = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (attempt > 1) {
                    console.warn(`[API] Attempt ${attempt}/${MAX_RETRIES}...`);
                }

                const rawResponse = await fetchRawAiResponse(env, messages);

                if (mode === "sentence") {
                    parsedData = parseSentenceData(rawResponse);
                } else {
                    parsedData = parseWordData(rawResponse);
                }

                break;
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "INVALID_INPUT_DETECTED"
                ) {
                    lastError = error;
                    break;
                }

                lastError = error;
                console.warn(
                    `[API] Attempt ${attempt} failed:`,
                    error instanceof Error ? error.message : error
                );
            }
        }

        if (!parsedData) {
            if (
                lastError instanceof Error &&
                lastError.message === "INVALID_INPUT_DETECTED"
            ) {
                return Response.json(
                    { success: false, error: "INVALID_INPUT" },
                    { status: 422 }
                );
            }

            console.error("[API] All retries failed.");
            throw lastError || new Error("AI_MODEL_FAILURE");
        }

        return Response.json({
            success: true,
            data: parsedData,
        } as ChatResponse);
    } catch (error: unknown) {
        console.error("[API] Global Handler Error:", error);

        let errorMessage = "Internal server error";
        let shouldUseFallback = false;

        if (error instanceof Error) {
            errorMessage = error.message;

            if (
                errorMessage === "AI_MODEL_FAILURE" ||
                errorMessage === "INVALID_JSON_FORMAT" ||
                errorMessage === "UNEXPECTED_AI_RESPONSE_FORMAT" ||
                errorMessage.includes("UNEXPECTED")
            ) {
                shouldUseFallback = true;
            }
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        if (shouldUseFallback) {
            return Response.json({
                success: false,
                data: createFallback(userWord),
                error: `AI unavailable after retries (${errorMessage}), using fallback`,
            } as ChatResponse);
        }

        return Response.json(
            { success: false, error: errorMessage } as ChatResponse,
            { status: 500 }
        );
    }
}
