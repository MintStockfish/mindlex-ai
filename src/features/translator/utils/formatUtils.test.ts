import { cleanAiResponse, parseAiResponse } from "./formatUtils";
import { ChatRequestSchema } from "./formatUtils";

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

describe("parseAiResponse", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("should throw an error if AI returns something other than an object or a string", () => {
        expect(() => {
            parseAiResponse(null, ChatRequestSchema, "Word");
        }).toThrow("UNEXPECTED_AI_RESPONSE_FORMAT");
    });

    test("should throw an error if AI returns JSON with error property", () => {
        expect(() => {
            parseAiResponse(
                '```json\n{"error": "INVALID_INPUT"}\n```',
                ChatRequestSchema,
                "Word"
            );
        }).toThrow("INVALID_INPUT_DETECTED");
    });

    test("should throw an error if AI returns wrong JSON", () => {
        expect(() => {
            parseAiResponse(
                '```json\n"anything"\n```',
                ChatRequestSchema,
                "Word"
            );
        }).toThrow("INVALID_JSON_FORMAT_WORD");
    });
});
