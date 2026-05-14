export type GeminiContentRole = "user" | "model";

export type GeminiFinishReason =
    | "FINISH_REASON_UNSPECIFIED"
    | "STOP"
    | "MAX_TOKENS"
    | "SAFETY"
    | "RECITATION"
    | "LANGUAGE"
    | "OTHER"
    | "BLOCKLIST"
    | "PROHIBITED_CONTENT"
    | "SPII"
    | "MALFORMED_FUNCTION_CALL"
    | "IMAGE_SAFETY"
    | "IMAGE_PROHIBITED_CONTENT"
    | "IMAGE_OTHER"
    | "NO_IMAGE"
    | "IMAGE_RECITATION"
    | "UNEXPECTED_TOOL_CALL";

export type GeminiBlockReason =
    | "BLOCK_REASON_UNSPECIFIED"
    | "SAFETY"
    | "OTHER"
    | "BLOCKLIST"
    | "PROHIBITED_CONTENT"
    | "IMAGE_SAFETY";

export type GeminiHarmCategory =
    | "HARM_CATEGORY_UNSPECIFIED"
    | "HARM_CATEGORY_DEROGATORY"
    | "HARM_CATEGORY_TOXICITY"
    | "HARM_CATEGORY_VIOLENCE"
    | "HARM_CATEGORY_SEXUAL"
    | "HARM_CATEGORY_MEDICAL"
    | "HARM_CATEGORY_DANGEROUS"
    | "HARM_CATEGORY_HARASSMENT"
    | "HARM_CATEGORY_HATE_SPEECH"
    | "HARM_CATEGORY_SEXUALLY_EXPLICIT"
    | "HARM_CATEGORY_DANGEROUS_CONTENT"
    | "HARM_CATEGORY_CIVIC_INTEGRITY";

export type GeminiHarmProbability =
    | "HARM_PROBABILITY_UNSPECIFIED"
    | "NEGLIGIBLE"
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export type GeminiModality =
    | "MODALITY_UNSPECIFIED"
    | "TEXT"
    | "IMAGE"
    | "VIDEO"
    | "AUDIO"
    | "DOCUMENT";

export type GeminiModelStage =
    | "MODEL_STAGE_UNSPECIFIED"
    | "UNSTABLE_EXPERIMENTAL"
    | "EXPERIMENTAL"
    | "PREVIEW"
    | "STABLE"
    | "LEGACY"
    | "DEPRECATED"
    | "RETIRED";

export interface GeminiBlob {
    mimeType?: string;
    data?: string;
}

export interface GeminiFileData {
    mimeType?: string;
    fileUri?: string;
}

export interface GeminiPart {
    text?: string;
    inlineData?: GeminiBlob;
    fileData?: GeminiFileData;
    functionCall?: Record<string, unknown>;
    functionResponse?: Record<string, unknown>;
    executableCode?: Record<string, unknown>;
    codeExecutionResult?: Record<string, unknown>;
    thought?: boolean;
    thoughtSignature?: string;
}

export interface GeminiContent {
    role?: GeminiContentRole;
    parts: GeminiPart[];
}

export interface GeminiSafetyRating {
    category: GeminiHarmCategory;
    probability: GeminiHarmProbability;
    blocked?: boolean;
}

export interface GeminiCandidate {
    content?: GeminiContent;
    finishReason?: GeminiFinishReason;
    safetyRatings?: GeminiSafetyRating[];
    citationMetadata?: Record<string, unknown>;
    tokenCount?: number;
    groundingAttributions?: Record<string, unknown>[];
    groundingMetadata?: Record<string, unknown>;
    avgLogprobs?: number;
    logprobsResult?: Record<string, unknown>;
    urlContextMetadata?: Record<string, unknown>;
    index?: number;
    finishMessage?: string;
}

export interface GeminiPromptFeedback {
    blockReason?: GeminiBlockReason;
    safetyRatings?: GeminiSafetyRating[];
}

export interface GeminiModalityTokenCount {
    modality: GeminiModality;
    tokenCount: number;
}

export interface GeminiUsageMetadata {
    promptTokenCount?: number;
    cachedContentTokenCount?: number;
    candidatesTokenCount?: number;
    toolUsePromptTokenCount?: number;
    thoughtsTokenCount?: number;
    totalTokenCount?: number;
    promptTokensDetails?: GeminiModalityTokenCount[];
    cacheTokensDetails?: GeminiModalityTokenCount[];
    candidatesTokensDetails?: GeminiModalityTokenCount[];
    toolUsePromptTokensDetails?: GeminiModalityTokenCount[];
}

export interface GeminiModelStatus {
    modelStage?: GeminiModelStage;
    retirementTime?: string;
    message?: string;
}

export interface GeminiGenerateContentResponse {
    candidates?: GeminiCandidate[];
    promptFeedback?: GeminiPromptFeedback;
    modelVersion?: string;
    responseId?: string;
    usageMetadata?: GeminiUsageMetadata;
    modelStatus?: GeminiModelStatus;
}

export interface GeminiErrorResponse {
    error: {
        code: number;
        message: string;
        status: string;
        details?: Record<string, unknown>[];
    };
}

export interface GeminiGenerateContentRequest {
    contents: GeminiContent[];
    generationConfig: {
        temperature: number;
        topP: number;
        topK: number;
        maxOutputTokens: number;
        responseMimeType: "application/json";
    };
}
