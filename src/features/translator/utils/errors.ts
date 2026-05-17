export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class AiServiceError extends Error {
    constructor(
        public userWord: string,
        message: string,
    ) {
        super(message);
        this.name = "AiServiceError";
    }
}

export type AiErrorInfoType = {
    provider: "openai" | "gemini" | "cloudflare";
    readonly message: string;
    readonly retryable: boolean;
    status?: number;
};

export type RetryableError = {
    readonly retryable: boolean;
};

export class AiProviderError extends Error {
    public readonly provider: AiErrorInfoType["provider"];
    public readonly retryable: boolean;
    public readonly status?: number;

    constructor(errorInfo: AiErrorInfoType) {
        super(errorInfo.message);
        this.name = "AiProviderError";
        this.provider = errorInfo.provider;
        this.status = errorInfo.status;
        this.retryable = errorInfo.retryable;
    }
}

export class AiOutputParseError extends Error {
    public readonly retryable: boolean;

    constructor(message: string, retryable: boolean = true) {
        super(message);
        this.name = "AiOutputParseError";
        this.retryable = retryable;
    }
}

export function isRetryableError(error: unknown): error is RetryableError {
    return (
        typeof error === "object" &&
        error !== null &&
        "retryable" in error &&
        typeof error.retryable === "boolean"
    );
}
