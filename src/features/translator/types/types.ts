interface WordData {
    word: string;
    languageCode: string;
    translation: string;
    exampleSentence: string;
    exampleTranslation: string;
    ipa: string;
    pronunciation: string;
    partsOfSpeech: {
        type: string;
        meaning: string;
        example: string;
    }[];
    synonyms: { word: string; ipa?: string }[];
    antonyms: { word: string; ipa?: string }[];
    usage: { informal: number; neutral: number; formal: number };
    etymology: string;
}

interface SentenceData {
    original: string;
    translation: string;
    words: {
        word: string;
        partOfSpeech: string;
        detail: {
            word: string;
            languageCode: string;
            translation: string;
            partOfSpeech: string;
            ipa: string;
            meaning: string;
            example: string;
        };
    }[];
}

interface ApiResponse {
    success: boolean;
    data?: WordData | SentenceData;
    error?: string;
}

interface HistoryItem {
    id: string;
    query: string;
    sourceLang: string;
    targetLang: string;
    type: "word" | "sentence";
    data: WordData | SentenceData;
    timestamp: number;
}

export type { ApiResponse, HistoryItem, SentenceData, WordData };
