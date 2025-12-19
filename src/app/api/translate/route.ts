import { getCloudflareContext } from "@opennextjs/cloudflare";
import { WordData } from "@/features/translator/types";
import {
    createSystemPrompt,
    parseWordData,
    createFallback,
    fetchRawAiResponse,
} from "@/features/translator/utils/apiUtils";

interface ChatRequest {
    prompt?: string;
    word?: string;
    sourceLang?: string;
    targetLang?: string;
}

interface ChatResponse {
    success: boolean;
    data?: WordData;
    error?: string;
}

export async function POST(request: Request): Promise<Response> {
    let userWord = "";

    try {
        const { env } = getCloudflareContext();
        const body: ChatRequest = await request.json();

        userWord = (body.prompt || body.word || "").trim();
        const sourceLang = body.sourceLang || "English";
        const targetLang = body.targetLang || "Russian";

        if (!userWord) {
            return Response.json(
                { success: false, error: "Word is required" },
                { status: 400 }
            );
        }

        const systemPrompt = createSystemPrompt(sourceLang, targetLang);

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userWord.toLowerCase() },
        ];

        const MAX_RETRIES = 3;
        let parsedData: WordData | null = null;
        let lastError: unknown = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (attempt > 1) {
                    console.warn(`[API] Attempt ${attempt}/${MAX_RETRIES}...`);
                }

                const rawResponse = await fetchRawAiResponse(env, messages);

                parsedData = parseWordData(rawResponse);

                break;
            } catch (error) {
                lastError = error;
                console.warn(
                    `[API] Attempt ${attempt} failed:`,
                    error instanceof Error ? error.message : error
                );
            }
        }

        if (!parsedData) {
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
