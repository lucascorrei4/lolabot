import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, insertMessage, listMessages, resolveSession, touchSession, getCollections } from "../../../../lib/db/mongo";
import { callOutgoingWebhook, toWebhookHistory, getMessageType } from "../../../../lib/webhook";
import type { Message } from "../../../../lib/types";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { sessionId, botId, userId, chatId, message, context } = body || {};

        console.log("[DIRECT_API] Received payload:", JSON.stringify(body, null, 2));
        console.log("[DIRECT_API] Resolving session:", sessionId);

        if (!message?.type) {
            return NextResponse.json({ error: "message.type is required" }, { status: 400 });
        }

        // 1. Resolve Session
        const session = sessionId
            ? await resolveById(sessionId)
            : await resolveSession({ botId, userId, chatId, createIfMissing: true });

        if (!session) {
            return NextResponse.json({ error: "session not found" }, { status: 404 });
        }

        await ensureIndexes();

        // 2. Determine Role
        const role = message.role || "user";

        // 3. Handle Bot Messages (Direct Injection)
        if (role === "bot") {
            const botMsg: Message = {
                sessionId: session._id as string,
                role: "bot",
                type: message.type,
                text: message.text,
                url: message.url,
                mime: message.mime,
                choices: message.choices,
                createdAt: new Date(),
            };
            await insertMessage(botMsg);
            await touchSession(session._id as string);

            return NextResponse.json({
                status: "success",
                sent: true,
                note: "Message sent to user chat. Proceed with next step."
            });
        }

        // 4. Handle User Messages (Trigger Flow)
        // Insert User Message
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

        // Insert "Immediate Ack" Message
        // TODO: Make this configurable in the future
        const ackMessage: Message = {
            sessionId: session._id as string,
            role: "bot",
            type: "text",
            text: "Ok, let me verify...",
            createdAt: new Date(Date.now() + 100), // Slight offset to ensure order
        };
        await insertMessage(ackMessage);

        // Call Outgoing Webhook
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
            response = { replies: [], output: null, metadata: {} };
        }

        // Insert Webhook Response Messages
        let replies = response.replies || [];
        if (replies.length === 0 && response.output) {
            const outputText = typeof response.output === 'string' ? response.output : JSON.stringify(response.output);
            replies = [{ type: 'text', text: outputText }];
        }

        const messageReplies: Message[] = replies.map((r: any, index: number) => ({
            sessionId: session._id as string,
            role: "bot",
            type: r.type || 'text',
            text: r.text,
            url: r.url,
            mime: r.mime,
            choices: r.choices,
            createdAt: new Date(Date.now() + 1000 + (index * 100)), // Ensure they come after ack
        }));

        for (const m of messageReplies) {
            try {
                await insertMessage(m);
            } catch (insertError: any) {
                console.error("Error inserting bot message:", insertError);
            }
        }

        // Return all new messages (User + Ack + Bot Responses)
        return NextResponse.json({
            userMessage: userMsg,
            ackMessage: ackMessage,
            replies: messageReplies,
            output: response.output,
            metadata: response.metadata,
        });

    } catch (error: any) {
        console.error("Error in POST /api/messages/direct:", error);
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
        return null;
    }
}
