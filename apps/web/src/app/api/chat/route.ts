import { mistral } from "@ai-sdk/mistral";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: mistral("codestral-latest"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
