export type AiMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

export interface AiProvider {
    fetch(messages: readonly AiMessage[]): Promise<string>;
}
