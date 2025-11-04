import { NextRequest, NextResponse } from "next/server";
import { resolveSession, ensureIndexes } from "../../../lib/db/mongo";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { botId, userId, chatId } = body || {};
  if (!botId) return NextResponse.json({ error: "botId is required" }, { status: 400 });
  await ensureIndexes();
  const session = await resolveSession({ botId, userId, chatId, createIfMissing: true });
  return NextResponse.json({ session });
}


