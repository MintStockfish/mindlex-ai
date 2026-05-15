export type OpenAiResponse = {
    status: string;
    output: OpenAiOutputItem[];
};

export type OpenAiOutputItem = {
    type: string;
    status?: string;
    role?: string;
    content?: OpenAiContentPart[];
};

export type OpenAiContentPart = {
    type: string;
    text?: string;
};

export type OpenAiErrorResponse = {
    error: {
        message: string;
        type?: string;
        code?: string | null;
        param?: string | null;
    };
};
