import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { getUserByEmail, upsertBotSettings, getBotSettings } from "../../../../lib/db/mongo";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { botId } = await params;
        const settings = await getBotSettings(botId);

        return NextResponse.json({ settings });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserByEmail(session.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { botId } = await params;
        const body = await request.json();

        // Only super admins can edit the slug, webhookOutgoingUrl, systemPrompt, or pageContexts
        if ((body.slug || body.webhookOutgoingUrl || body.systemPrompt !== undefined || body.pageContexts !== undefined) && user.role !== 'super_admin') {
            return NextResponse.json(
                { error: "Only super admins can edit the slug, webhook URL, system prompt, or page contexts" },
                { status: 403 }
            );
        }

        const settings = await upsertBotSettings({
            botId,
            title: body.title,
            description: body.description,
            shortName: body.shortName,
            slug: body.slug,
            initialGreeting: body.initialGreeting,
            webhookOutgoingUrl: body.webhookOutgoingUrl,
            systemPrompt: body.systemPrompt,
            pageContexts: body.pageContexts,
            notificationEmail: body.notificationEmail,
            timezone: body.timezone,
            updatedBy: session.email,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to save settings" },
            { status: 500 }
        );
    }
}
