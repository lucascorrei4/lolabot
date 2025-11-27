import { NextRequest, NextResponse } from "next/server";
import { resolveSession, ensureIndexes, getCollections } from "../../../lib/db/mongo";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  try {
    await ensureIndexes();
    const { sessions } = await getCollections();
    const session = await sessions.findOne({ _id: new ObjectId(sessionId) } as any);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check expiration
    const now = new Date();
    const lastActivity = new Date(session.lastActivityAt || session.updatedAt || session.createdAt);
    const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastActivity > 24) {
      return NextResponse.json({ error: "Session expired" }, { status: 410 });
    }

    return NextResponse.json({ session: { ...session, _id: session._id.toString() } });
  } catch (error) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { botId, userId, chatId } = body || {};
  if (!botId) return NextResponse.json({ error: "botId is required" }, { status: 400 });
  await ensureIndexes();
  const session = await resolveSession({ botId, userId, chatId, createIfMissing: true });
  return NextResponse.json({ session });
}
