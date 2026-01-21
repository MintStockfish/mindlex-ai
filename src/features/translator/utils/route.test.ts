import { POST } from "@/app/api/translate/route";

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

const createTestRequest = (body: object) => {
    return new Request("http://localhost/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

describe("route", () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockAiRun.mockReset();
        consoleWarnSpy = jest
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test("should return code 400 if it has wrong fields", async () => {
        const req = createTestRequest({
            wordd: "water",
            mode: "word",
            sourceLang: "English",
            targetLang: "Russian",
        });

        const response = await POST(req);

        expect(response.status).toEqual(400);
    });

    test("should succeed if everything is correct", async () => {
        const req = createTestRequest({
            word: "water",
            mode: "word",
            sourceLang: "English",
            targetLang: "Russian",
        });

        mockAiRun.mockResolvedValue({
            response: JSON.stringify({
                word: "water",
                languageCode: "en",
                translation: "вода",
                exampleSentence: "I drink water",
                exampleTranslation: "Я пью воду",
                ipa: "/ˈwɔːtər/",
                pronunciation: "вотер",
                partsOfSpeech: [
                    {
                        type: "Noun",
                        meaning: "прозрачная жидкость",
                        example: "drink water",
                    },
                ],
                synonyms: [],
                antonyms: [],
                usage: { informal: 10, neutral: 80, formal: 10 },
                etymology: "Old English 'wæter'",
            }),
        });

        const response = await POST(req);

        expect(response.status).toEqual(200);
    });

    test("should return 502 if AI response is malformed or retries exceeded", async () => {
        const req = createTestRequest({
            word: "water",
            mode: "word",
            sourceLang: "English",
            targetLang: "Russian",
        });

        mockAiRun.mockResolvedValue({
            response: JSON.stringify({
                translation: "вода",
                ipa: "/ˈwɔːtər/",
                pronunciation: "вотер",
                partsOfSpeech: [
                    {
                        type: "Noun",
                        meaning: "прозрачная жидкость",
                        example: "drink water",
                    },
                ],
                synonyms: [],
                antonyms: [],
                usage: { informal: 10, neutral: 80, formal: 10 },
                etymology: "Old English 'wæter'",
            }),
        });

        const response = await POST(req);

        expect(response.status).toEqual(502);
    });

    test("should return 500 if something totally unexpected happens", async () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getCloudflareContext } = require("@opennextjs/cloudflare");
        getCloudflareContext.mockImplementationOnce(() => {
            throw new Error("Database is on fire!");
        });

        const req = createTestRequest({ word: "test" });
        const response = await POST(req);

        expect(response.status).toBe(500);
        const body = (await response.json()) as {
            success: boolean;
            error: string;
        };
        expect(body.error!).toBe("Internal server error");
    });
});
