import { isRetryableError } from "./errors";

async function withRetries<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 1)
                console.warn(`[API] Retry attempt ${attempt}/${maxRetries}...`);
            return await fn();
        } catch (error) {
            lastError = error;

            if (isRetryableError(error) && !error.retryable) {
                throw error;
            }

            console.warn(`[API] Attempt ${attempt} failed:`, error);
        }
    }
    throw lastError || new Error("MAX_RETRIES_EXCEEDED");
}

export { withRetries };
