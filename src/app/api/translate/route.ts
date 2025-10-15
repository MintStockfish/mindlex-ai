import { getCloudflareContext } from "@opennextjs/cloudflare";

interface ChatRequest {
  prompt: string;
}

interface ChatResponse {
  success: boolean;
  message?: Ai_Cf_Mistralai_Mistral_Small_3_1_24B_Instruct_Output;
  error?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { env } = await getCloudflareContext();

    const body: ChatRequest = await request.json();
    const additionalPromt = `Я буду тебе давать слово, ты должен расписать:
    1. Перевод и пример предложения с этим словом.
    2. Транскрипция, а также произношение русскими символами
    3. Если слово имеет форму в разных частях речи, то опиши их
    4. Синонимы и антонимы с транскрипциями
    5. Где чаще используется (в разговорном, литературной, газетном и т.п)
    6. Происхождение
    `;

    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Valid prompt is required",
        } as ChatResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await env.AI.run(
      "@cf/mistralai/mistral-small-3.1-24b-instruct",
      {
        prompt: additionalPromt + prompt,
        max_tokens: 256,
        stream: false,
      }
    );

    const response: ChatResponse = {
      success: true,
      message: aiResponse,
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
