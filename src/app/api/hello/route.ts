import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext();
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-awq", {
    prompt: "Hi, how are you?",
  });

  return new Response(JSON.stringify(response));
}
