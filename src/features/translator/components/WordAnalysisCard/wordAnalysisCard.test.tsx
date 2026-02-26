import { screen } from "@testing-library/react";

import { renderWithProviders } from "@/__tests__/render-with-providers";

import { WordAnalysis } from "./index";

import { WordData } from "../../types/types";

import "@testing-library/jest-dom";

const mockWordData: WordData = {
    word: "hello",
    languageCode: "en",
    translation: "привет",
    exampleSentence: "Hello world",
    exampleTranslation: "Привет мир",
    ipa: "/həˈloʊ/",
    pronunciation: "he-LO",
    partsOfSpeech: [
        {
            type: "interjection",
            meaning: "used as a greeting",
            example: "Hello! How are you?",
        },
    ],
    synonyms: [{ word: "hi", ipa: "/haɪ/" }],
    antonyms: [{ word: "goodbye" }],
    usage: {
        informal: 60,
        neutral: 30,
        formal: 10,
    },
    etymology: "From Old English",
};

const mockWrongWordData: WordData = {
    word: "",
    languageCode: "en",
    translation: "привет",
    exampleSentence: "Hello world",
    exampleTranslation: "Привет мир",
    ipa: "/həˈloʊ/",
    pronunciation: "he-LO",
    partsOfSpeech: [
        {
            type: "interjection",
            meaning: "used as a greeting",
            example: "Hello! How are you?",
        },
    ],
    synonyms: [{ word: "hi", ipa: "/haɪ/" }],
    antonyms: [{ word: "goodbye" }],
    usage: {
        informal: 60,
        neutral: 30,
        formal: 10,
    },
    etymology: "From Old English",
};

describe("WordAnalysis", () => {
    test("рендерит данные слова", () => {
        renderWithProviders(<WordAnalysis wordData={mockWordData} />);

        expect(screen.getByText("привет")).toBeInTheDocument();
        expect(screen.getByText("hello")).toBeInTheDocument();
        expect(screen.getByText("From Old English")).toBeInTheDocument();
    });

    test("рендерит данные слова", () => {
        renderWithProviders(<WordAnalysis wordData={mockWrongWordData} />);

        expect(screen.queryByText("hello")).not.toBeInTheDocument();
    });
});
