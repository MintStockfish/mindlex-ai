import { cleanAiResponse } from "./formatUtils";

describe("cleanAiResponse", () => {
    test("should delete md", () => {
        const raw = '```json\n{"word": "test"}\n```';
        const result = cleanAiResponse(raw);

        expect(result).toBe('{"word": "test"}');
    });

    test("should handle mixed case JSON tag", () => {
        const raw = '```JSon\n{"word": "test"}\n```';
        const result = cleanAiResponse(raw);

        expect(result).toBe('{"word": "test"}');
    });

    test("should return plain string if no markdown is present", () => {
        const raw = "wasabi";
        const result = cleanAiResponse(raw);

        expect(result).toBe("wasabi");
    });

    test("should handle extra whitespace and newlines", () => {
        const raw =
            '```              json\n\n\n\n{"word": "test"}                 \n```';
        const result = cleanAiResponse(raw);

        expect(result).toBe('{"word": "test"}');
    });

    test("should handle multiple code blocks", () => {
        const raw =
            '```json\n{"word": "test"}\n``` ```json\n{"word": "test"}\n```';
        const result = cleanAiResponse(raw);

        expect(result).toBe('{"word": "test"}');
    });
});
