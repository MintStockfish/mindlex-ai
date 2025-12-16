export interface Word {
    id: string;
    name: string;
    translation: string;
    ipa: string;
}

export interface Module {
    id: string;
    title: string;
    description: string;
    words: Word[];
    wordCount: number;
}
