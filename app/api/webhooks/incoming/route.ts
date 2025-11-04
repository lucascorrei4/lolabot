import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, insertMessage, resolveSession } from "../../../../lib/db/mongo";
import { verifyHmac } from "../../../../lib/security";
import { env } from "../../../../lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-lolabot-signature");
  if (env.WEBHOOK_SIGNATURE_SECRET && !verifyHmac(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  const body = safeParseJson(raw);
  const { botId, session, message } = body || {};
  if (!botId) return NextResponse.json({ error: "botId is required" }, { status: 400 });
  if (!session?.userId && !session?.chatId) return NextResponse.json({ error: "session.userId or session.chatId required" }, { status: 400 });
  if (!message?.type) return NextResponse.json({ error: "message.type is required" }, { status: 400 });

  await ensureIndexes();
  const s = await resolveSession({ botId, userId: session.userId, chatId: session.chatId, createIfMissing: true });
  const now = new Date();
  await insertMessage({
    sessionId: s._id as string,
    role: "bot",
    type: message.type,
    text: message.text,
    url: message.url,
    mime: message.mime,
    choices: message.choices,
    createdAt: now,
  });
  return NextResponse.json({ ok: true });
}

function safeParseJson(raw: string) {
  try { return JSON.parse(raw); } catch { return {}; }
}


