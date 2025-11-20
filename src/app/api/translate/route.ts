import { getCloudflareContext } from "@opennextjs/cloudflare";

interface ChatRequest {
    prompt: string;
}

interface ChatResponse {
    success: boolean;
    message?: {
        response: Ai_Cf_Openai_Gpt_Oss_120B_Output;
    };
    error?: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const { env } = getCloudflareContext();

        const body: ChatRequest & { word?: string } = await request.json();
        console.log("API /translate received body:", body);

        const systemPrompt = `Ты — API, которое получает английское слово и возвращает всю информацию о нём в строго заданном JSON-формате. Не добавляй никаких объяснений или лишнего текста вне JSON. Пример формата:
    {
      "word": "comprehend",
      "translation": "понимать, постигать",
      "exampleSentence": "It's difficult to comprehend the scale of the universe.",
      "exampleTranslation": "Трудно постичь масштабы вселенной.",
      "ipa": "/ˌkɒmprɪˈhend/",
      "pronunciation": "ка́мприхэ́нд",
      "partsOfSpeech": [
        { "type": "Verb", "meaning": "Понимать или постигать что-то полностью", "example": "She couldn't comprehend what had happened." },
        { "type": "Verb (formal)", "meaning": "Включать, охватывать", "example": "The course comprehends all aspects of business management." }
      ],
      "synonyms": [
        { "word": "understand", "ipa": "/ˌʌndəˈstænd/" },
        { "word": "grasp", "ipa": "/ɡrɑːsp/" }
      ],
      "antonyms": [
        { "word": "misunderstand", "ipa": "/ˌmɪsʌndəˈstænd/" }
      ],
      "usage": { "informal": 15, "neutral": 60, "formal": 25 },
      "etymology": "От латинского 'comprehendere', от com- (полностью) + prehendere (схватывать). Вошло в английский через старофранцузский в XIV веке."
    }`;

        const userWord = body.prompt || body.word;

        if (!userWord || typeof userWord !== "string") {
            console.error("Invalid prompt received. Body keys:", Object.keys(body));
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Valid prompt is required. Received keys: ${Object.keys(body).join(", ")}`,
                } as ChatResponse),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userWord },
        ];

        const aiResponse = await env.AI.run(
            "@cf/openai/gpt-oss-120b",
            { input: messages }
        );

        const response: ChatResponse = {
            success: true,
            message: {
                response: aiResponse,
            },
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("API Error:", error);

        const errorResponse: ChatResponse = {
            success: false,
            error: "Internal server error",
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
