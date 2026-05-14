import {
    AiMessage,
    AiProvider,
} from "@/features/translator/services/ai-providers/types";

type OpenAiResponse = {
    output: {
        content: {
            text?: string;
        }[];
    }[];
};

function buildQuery(messages: readonly AiMessage[]) {
    return { input: messages[1].content, instructions: messages[0].content };
}

export class OpenAiProvider implements AiProvider {
    constructor(private readonly apiKey: string) {}

    async fetch(messages: readonly AiMessage[]): Promise<string> {
        const { input, instructions } = buildQuery(messages);

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-5.4-mini",
                input,
                instructions,
                store: false,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response
                .text()
                .catch((error: unknown) =>
                    error instanceof Error ? error.message : String(error),
                );

            throw new Error(
                `OpenAI API error ${response.status}: ${errorMessage}`,
            );
        }

        const result = (await response.json()) as OpenAiResponse;
        const text = result.output[0]?.content[0]?.text;

        if (!text) {
            throw new Error("UNEXPECTED_OPENAI_RESPONSE_FORMAT");
        }

        return text;
    }
}
