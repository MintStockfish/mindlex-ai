async function fetchRawAiResponse(
    env: CloudflareEnv,
    messages: {
        role: string;
        content: string;
    }[],
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
        throw new Error("UNEXPECTED_AI_RESPONSE_FORMAT");
    }

    if (typeof result === "object" && result !== null && "response" in result) {
        return (result as { response: string }).response;
    }

    return String(result);
}

async function withRetries<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 1)
                console.warn(`[API] Retry attempt ${attempt}/${maxRetries}...`);
            return await fn();
        } catch (error) {
            lastError = error;
            if (
                error instanceof Error &&
                error.message === "INVALID_INPUT_DETECTED"
            ) {
                throw error;
            }
            console.warn(`[API] Attempt ${attempt} failed:`, error);
        }
    }
    throw lastError || new Error("MAX_RETRIES_EXCEEDED");
}

export { fetchRawAiResponse, withRetries };
