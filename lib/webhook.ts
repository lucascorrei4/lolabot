import { z } from "zod";
import { env } from "./env";
import type { Message, MessageType } from "./types";

export const WebhookReplySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("image"), url: z.string().url() }),
  z.object({ type: z.literal("audio"), url: z.string().url(), mime: z.string().optional() }),
  z.object({
    type: z.literal("choice"),
    text: z.string().optional(),
    choices: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
]);

export const WebhookResponseSchema = z.object({
  replies: z.array(WebhookReplySchema).default([]),
  metadata: z.record(z.any()).optional(),
  output: z.any().optional(),
});

export function getMessageType(type: MessageType): string {
  switch (type) {
    case "text":
      return "conversation";
    case "audio":
      return "audioMessage";
    case "image":
      return "imageMessage";
    default:
      return "conversation";
  }
}

export async function callOutgoingWebhook(payload: any) {
  const res = await fetch(env.WEBHOOK_OUTGOING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Webhook error: ${res.status} ${text}`);
  }
  
  // Read response as text first to check if it's empty
  const text = await res.text().catch(() => "");
  
  // If empty response, return default empty structure
  if (!text || text.trim() === "") {
    return WebhookResponseSchema.parse({ replies: [], output: null, metadata: {} });
  }
  
  // Try to parse as JSON
  try {
    const json = JSON.parse(text);
    return WebhookResponseSchema.parse(json);
  } catch (parseError) {
    // Not valid JSON - log error and return default empty structure
    console.warn("Webhook returned non-JSON response:", text.substring(0, 100));
    return WebhookResponseSchema.parse({ replies: [], output: null, metadata: {} });
  }
}

export function toWebhookHistory(messages: Message[]) {
  return messages.map((m) => ({ 
    role: m.role, 
    type: m.type, 
    messageType: getMessageType(m.type),
    text: m.text, 
    url: m.url, 
    mime: m.mime, 
    choices: m.choices 
  }));
}


