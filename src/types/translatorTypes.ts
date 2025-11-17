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
    usage: { informal: string; neutral: string; formal: string };
    etymology: string;
}

interface MessageContent {
    text: string;
}

interface OutputBlock {
    type: string;
    content?: MessageContent[];
}

interface ApiResponse {
    success: boolean;
    message?: {
        response: {
            output: OutputBlock[];
        };
    };
    error?: string;
}

export type { WordData, OutputBlock, ApiResponse };
