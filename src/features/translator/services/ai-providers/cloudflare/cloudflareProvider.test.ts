import { extractCloudflareText } from "./cloudflareUtils";

type CloudflareResult = Parameters<typeof extractCloudflareText>[0];

describe("extractCloudflareText", () => {
    test("returns output_text from simple Responses API output", () => {
        const result = {
            output_text: "Simple answer",
        } as CloudflareResult;

        expect(extractCloudflareText(result)).toBe("Simple answer");
    });

    test("returns text from structured output content", () => {
        const result = {
            output: [
                {
                    type: "message",
                    content: [
                        {
                            type: "output_text",
                            text: "Structured answer",
                        },
                    ],
                },
            ],
        } as CloudflareResult;

        expect(extractCloudflareText(result)).toBe("Structured answer");
    });

    test("returns text from chat completions choices", () => {
        const result = {
            choices: [
                {
                    message: {
                        content: "Choice answer",
                    },
                },
            ],
        } as CloudflareResult;

        expect(extractCloudflareText(result)).toBe("Choice answer");
    });

    test("throws if Cloudflare output has no supported text content", () => {
        const result = {
            output: [
                {
                    type: "message",
                    content: [],
                },
            ],
        } as unknown as CloudflareResult;

        expect(() => extractCloudflareText(result)).toThrow(
            "UNEXPECTED_AI_RESPONSE_FORMAT",
        );
    });
});
