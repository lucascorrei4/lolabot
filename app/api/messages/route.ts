import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, insertMessage, listMessages, resolveSession, getCollections, touchSession } from "../../../lib/db/mongo";
import { callOutgoingWebhook, toWebhookHistory, getMessageType } from "../../../lib/webhook";
import type { Message } from "../../../lib/types";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");
  
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  
  await ensureIndexes();
  const messages = await listMessages(sessionId, 100);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, botId, userId, chatId, message, context } = body || {};

    if (!message?.type) {
      return NextResponse.json({ error: "message.type is required" }, { status: 400 });
    }

    const session = sessionId
      ? await resolveById(sessionId)
      : await resolveSession({ botId, userId, chatId, createIfMissing: true });

    if (!session) {
      return NextResponse.json({ error: "session not found" }, { status: 404 });
    }

    await ensureIndexes();

    const userMsg: Message = {
      sessionId: session._id as string,
      role: "user",
      type: message.type,
      text: message.text,
      url: message.url,
      mime: message.mime,
      createdAt: new Date(),
    };
    await insertMessage(userMsg);
    await touchSession(session._id as string);

    const history = await listMessages(session._id as string, 100);
    const payload = {
      botId: session.botId,
      session: { id: session._id, userId: session.userId, chatId: session.chatId },
      message: { 
        role: "user", 
        type: message.type, 
        messageType: getMessageType(message.type),
        text: message.text, 
        url: message.url, 
        mime: message.mime 
      },
      history: toWebhookHistory(history),
      context: context,
    };

    let response;
    try {
      response = await callOutgoingWebhook(payload, session.botId);
    } catch (webhookError: any) {
      console.error("Webhook error:", webhookError);
      // Continue with empty response if webhook fails
      response = { replies: [], output: null, metadata: {} };
    }

    // If output exists but no replies, convert output to a text reply
    let replies = response.replies || [];
    if (replies.length === 0 && response.output) {
      // Convert output to a text reply
      const outputText = typeof response.output === 'string' ? response.output : JSON.stringify(response.output);
      replies = [{ type: 'text', text: outputText }];
    }

    // Log for debugging
    if (replies.length === 0) {
      console.warn('No replies from webhook. Response:', JSON.stringify(response, null, 2));
    }

    const messageReplies: Message[] = replies.map((r: any) => ({
      sessionId: session._id as string,
      role: "bot",
      type: r.type || 'text',
      text: r.text,
      url: r.url,
      mime: r.mime,
      choices: r.choices,
      createdAt: new Date(),
    }));

    for (const m of messageReplies) {
      try {
        await insertMessage(m);
      } catch (insertError: any) {
        console.error("Error inserting bot message:", insertError);
        // Continue with other messages even if one fails
      }
    }

    return NextResponse.json({ 
      replies: messageReplies,
      output: response.output,
      metadata: response.metadata,
    });
  } catch (error: any) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error", details: error.stack },
      { status: 500 }
    );
  }
}

async function resolveById(id: string) {
  try {
    const { sessions } = await getCollections();
    const doc = await sessions.findOne({ _id: new ObjectId(id) } as any);
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as any;
  } catch (err) {
    // Invalid ObjectId format or other error
    return null;
  }
}


