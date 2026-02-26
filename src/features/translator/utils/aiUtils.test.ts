import { getCloudflareContext } from "@opennextjs/cloudflare";

import { fetchRawAiResponse, withRetries } from "./aiUtils";

const mockAiRun = jest.fn();

jest.mock("@opennextjs/cloudflare", () => ({
    getCloudflareContext: jest.fn(() => ({
        env: {
            AI: {
                run: mockAiRun,
            },
        },
    })),
}));

describe("withRetries", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("should call function once if it succeded", async () => {
        const foo = jest.fn().mockResolvedValueOnce({ data: true });

        const result = await withRetries(foo);

        expect(foo).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ data: true });
    });

    test("should exit immediately if INVALID_INPUT_DETECTED occurs", async () => {
        const foo = jest.fn();

        foo.mockRejectedValue(new Error("INVALID_INPUT_DETECTED"));

        await expect(withRetries(foo)).rejects.toThrow(
            "INVALID_INPUT_DETECTED",
        );
        expect(foo).toHaveBeenCalledTimes(1);
    });

    test("should retry exactly 3 times before giving up", async () => {
        const foo = jest.fn();

        foo.mockRejectedValue(new Error("MAX_RETRIES_EXCEEDED"));

        await expect(withRetries(foo)).rejects.toThrow("MAX_RETRIES_EXCEEDED");
        expect(foo).toHaveBeenCalledTimes(3);
    });

    test("should exit if it succeeded after errors", async () => {
        const successData = { data: "AI is finally awake" };
        const foo = jest
            .fn()
            .mockRejectedValueOnce(new Error("First Error"))
            .mockRejectedValueOnce(new Error("Second Error"))
            .mockResolvedValueOnce(successData);

        const result = await withRetries(foo);

        expect(foo).toHaveBeenCalledTimes(3);
        expect(result).toEqual(successData);
    });
});

describe("fetchRawAiResponse", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should end successfully if everything is fine", async () => {
        mockAiRun.mockResolvedValue({
            output: [{ type: "message", content: [{ text: "hey!" }] }],
        });

        await expect(
            fetchRawAiResponse(getCloudflareContext().env, [
                {
                    role: "role",
                    content: "text",
                },
            ]),
        ).resolves.toBe("hey!");
    });

    test("should handle simple response format", async () => {
        mockAiRun.mockResolvedValue({
            response: "Simple answer",
        });

        await expect(
            fetchRawAiResponse(getCloudflareContext().env, [
                { role: "user", content: "test" },
            ]),
        ).resolves.toBe("Simple answer");
    });

    test("should convert primitive result to string", async () => {
        mockAiRun.mockResolvedValue("raw string response");

        await expect(
            fetchRawAiResponse(getCloudflareContext().env, [
                { role: "user", content: "test" },
            ]),
        ).resolves.toBe("raw string response");
    });

    test("should fail if AI output is incorrect", async () => {
        mockAiRun.mockResolvedValue({
            output: [{ type: "message", content: [] }],
        });

        await expect(
            fetchRawAiResponse(getCloudflareContext().env, [
                {
                    role: "user",
                    content: "text",
                },
            ]),
        ).rejects.toThrow("UNEXPECTED_AI_RESPONSE_FORMAT");
    });
});
