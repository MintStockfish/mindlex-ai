import { withRetries } from "./aiUtils";
describe("withRetries", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("should call function once if it succeded", async () => {
        const foo = jest.fn().mockResolvedValueOnce({ data: true });

        const result = await withRetries(foo);

        expect(foo).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ data: true });
    });

    test("should exit immediately if INVALID_INPUT_DETECTED occurs", async () => {
        const foo = jest.fn();

        foo.mockRejectedValue(new Error("INVALID_INPUT_DETECTED"));

        await expect(withRetries(foo)).rejects.toThrow(
            "INVALID_INPUT_DETECTED",
        );
        expect(foo).toHaveBeenCalledTimes(1);
    });

    test("should calls function three if fails", async () => {
        const foo = jest.fn();

        foo.mockRejectedValue(new Error("MAX_RETRIES_EXCEEDED"));

        await expect(withRetries(foo)).rejects.toThrow("MAX_RETRIES_EXCEEDED");
        expect(foo).toHaveBeenCalledTimes(3);
    });

    test("should exit if it succeeded after errors", async () => {
        const successData = { data: "AI is finally awake" };
        const foo = jest
            .fn()
            .mockRejectedValueOnce(new Error("First Error"))
            .mockRejectedValueOnce(new Error("Second Error"))
            .mockResolvedValueOnce(successData);

        const result = await withRetries(foo);

        expect(foo).toHaveBeenCalledTimes(3);
        expect(result).toEqual(successData);
    });
});
