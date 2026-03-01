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
