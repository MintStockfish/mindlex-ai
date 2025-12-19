interface WordData {
    word: string;
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
    synonyms: { word: string; ipa: string }[];
    antonyms: { word: string; ipa: string }[];
    usage: { informal: number; neutral: number; formal: number };
    etymology: string;
}

interface ApiResponse {
    success: boolean;
    data?: WordData;
    error?: string;
}

export type { WordData, ApiResponse };
