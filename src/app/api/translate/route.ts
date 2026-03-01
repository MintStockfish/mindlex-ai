import { getCloudflareContext } from "@opennextjs/cloudflare";

import { TransaltionService } from "@/features/translator/services/TranslationService";
import {
    AiServiceError,
    ValidationError,
} from "@/features/translator/utils/errors";
import {
    type ChatRequest,
    createFallback,
} from "@/features/translator/utils/formatUtils";

export async function POST(request: Request): Promise<Response> {
    try {
        const { env } = getCloudflareContext();
        const body: ChatRequest = await request.json();

        const translatorService = new TransaltionService(env);
        const data = await translatorService.translate(body);

        return Response.json({ success: true, data });
    } catch (error: unknown) {
        console.error("[API] Handler Error:", error);

        if (error instanceof ValidationError) {
            return Response.json({ error: error.message }, { status: 400 });
        } else if (error instanceof AiServiceError) {
            return Response.json(
                {
                    data: createFallback(error.userWord),
                    error: `AI unavailable (${error.message}), using fallback`,
                },
                { status: 502 },
            );
        }

        return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
