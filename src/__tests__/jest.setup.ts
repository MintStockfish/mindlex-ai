import "whatwg-fetch";
import "@testing-library/jest-dom";

if (!Response.json) {
    Response.json = (data: unknown, init?: ResponseInit): Response => {
        const body = JSON.stringify(data);
        return new Response(body, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers || {}),
            },
        });
    };
}

const mockSpeechSynthesis: SpeechSynthesis = {
    cancel: jest.fn<void, []>(),
    speak: jest.fn<void, [SpeechSynthesisUtterance]>(),
    pause: jest.fn<void, []>(),
    resume: jest.fn<void, []>(),
    getVoices: jest.fn<SpeechSynthesisVoice[], []>(() => []),
    pending: false,
    speaking: false,
    paused: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn<boolean, [Event]>(() => true),
    onvoiceschanged: null,
};

global.window.speechSynthesis = mockSpeechSynthesis;

global.SpeechSynthesisUtterance = jest
    .fn<SpeechSynthesisUtterance, [string?]>()
    .mockImplementation((text = "") => {
        const utterance: Partial<SpeechSynthesisUtterance> = {
            text,
            lang: "",
            voice: null,
            volume: 1,
            rate: 1,
            pitch: 1,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(() => true),
            onstart: null,
            onend: null,
            onerror: null,
            onpause: null,
            onresume: null,
            onmark: null,
            onboundary: null,
        };
        return utterance as SpeechSynthesisUtterance;
    }) as unknown as {
    new (text?: string): SpeechSynthesisUtterance;
    prototype: SpeechSynthesisUtterance;
};
