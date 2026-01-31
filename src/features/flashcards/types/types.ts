import { Dispatch, SetStateAction } from "react";

export interface Word {
    id?: string;
    name: string;
    translation: string;
    ipa: string;
    languageCode?: string;
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    words: Word[];
    wordCount: number;
}

export interface ModulesHeaderProps {
    isDialogOpen: boolean;
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}
