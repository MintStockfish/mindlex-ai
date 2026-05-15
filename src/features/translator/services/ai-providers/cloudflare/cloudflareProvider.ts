import { CLOUDFLARE_MODEL } from "./cloudflareTypes";
import { extractCloudflareText } from "./cloudflareUtils";

import { AiMessage, AiProvider } from "../types";

export class CloudflareProvider implements AiProvider {
    constructor(private readonly env: CloudflareEnv) {}

    public async fetch(messages: readonly AiMessage[]): Promise<string> {
        const result = await this.env.AI.run(CLOUDFLARE_MODEL, {
            input: [...messages],
        });
        return extractCloudflareText(result);
    }
}
