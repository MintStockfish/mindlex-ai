import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
    parseWordData,
    parseSentenceData,
    createFallback,
    prepareTranslationRequest,
    type ChatRequest,
} from "@/features/translator/utils/formatUtils";

import {
    fetchRawAiResponse,
    withRetries,
} from "@/features/translator/utils/aiUtils";

export async function POST(request: Request): Promise<Response> {
    let userWordForFallback = "";

    try {
        const { env } = getCloudflareContext();
        const body: ChatRequest = await request.json();

        const { userWord, mode, messages } = prepareTranslationRequest(body);
        userWordForFallback = userWord;

        const data = await withRetries(async () => {
            const rawResponse = await fetchRawAiResponse(env, messages);

            if (mode === "sentence") {
                return parseSentenceData(rawResponse);
            }
            return parseWordData(rawResponse);
        }, 3);

        return Response.json({ success: true, data });
    } catch (error: unknown) {
        console.error("[API] Handler Error:", error);

        if (
            error instanceof Error &&
            error.message.startsWith("VALIDATION_ERROR")
        ) {
            return Response.json(
                {
                    success: false,
                    error: error.message.replace("VALIDATION_ERROR: ", ""),
                },
                { status: 400 }
            );
        }

        const errorMessage =
            error instanceof Error ? error.message : String(error);

        const isAiFailure =
            errorMessage === "MAX_RETRIES_EXCEEDED" ||
            errorMessage.includes("AI_MODEL_FAILURE") ||
            errorMessage.includes("JSON");

        if (isAiFailure && userWordForFallback) {
            return Response.json({
                success: false,
                data: createFallback(userWordForFallback),
                error: `AI unavailable (${errorMessage}), using fallback`,
            });
        }

        return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
