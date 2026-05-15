import { CloudflareOutput } from "./cloudflareTypes";

export function extractCloudflareText(result: CloudflareOutput): string {
    if (!hasCloudflareText(result)) {
        throw new Error("UNEXPECTED_AI_RESPONSE_FORMAT");
    }

    return getCloudflareText(result);
}

function hasCloudflareText(result: CloudflareOutput): boolean {
    if ("output_text" in result && typeof result.output_text === "string") {
        return true;
    }

    if ("output" in result && Array.isArray(result.output)) {
        return result.output.some(
            (item) =>
                item.type === "message" &&
                item.content.some((part) => {
                    return part.type === "output_text" && Boolean(part.text);
                }),
        );
    }

    if ("choices" in result) {
        return Boolean(result.choices?.[0]?.message.content);
    }

    return false;
}

function getCloudflareText(result: CloudflareOutput): string {
    if ("output_text" in result && typeof result.output_text === "string") {
        return result.output_text;
    }

    if ("output" in result && Array.isArray(result.output)) {
        return (
            result.output
                .find((item) => item.type === "message")
                ?.content.find((part) => part.type === "output_text")?.text ??
            ""
        );
    }

    if ("choices" in result) {
        return result.choices?.[0]?.message.content ?? "";
    }

    return "";
}
