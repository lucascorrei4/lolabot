import { NextRequest, NextResponse } from "next/server";
import { listSessions, listMessages } from "../../../../../lib/db/mongo";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    try {
        const { botId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const format = searchParams.get("format") || "json";

        // Fetch all sessions for this bot (no pagination for export)
        const sessions = await listSessions(1000, 0, botId);

        // Fetch messages for each session
        const allData = await Promise.all(
            sessions.map(async (session) => {
                const messages = await listMessages(session._id.toString(), 1000);
                return {
                    sessionId: session._id.toString(),
                    userId: session.userId || "Anonymous",
                    createdAt: session.createdAt,
                    lastActivityAt: session.lastActivityAt,
                    interactionCount: (session as any).interactionCount || 0,
                    messages: messages.map((msg) => ({
                        role: msg.role,
                        type: msg.type,
                        text: msg.text,
                        createdAt: msg.createdAt,
                    })),
                };
            })
        );

        if (format === "csv") {
            // Generate CSV
            const csvRows = [
                ["Session ID", "User ID", "Created At", "Last Activity", "Interactions", "Message Role", "Message Type", "Message Text", "Message Time"],
            ];

            allData.forEach((session) => {
                session.messages.forEach((msg) => {
                    csvRows.push([
                        session.sessionId,
                        session.userId,
                        new Date(session.createdAt).toISOString(),
                        new Date(session.lastActivityAt || session.createdAt).toISOString(),
                        session.interactionCount.toString(),
                        msg.role,
                        msg.type,
                        `"${(msg.text || "").replace(/"/g, '""')}"`, // Escape quotes
                        new Date(msg.createdAt).toISOString(),
                    ]);
                });
            });

            const csvContent = csvRows.map((row) => row.join(",")).join("\n");

            return new NextResponse(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="${botId}_export_${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        } else {
            // Return JSON
            return new NextResponse(JSON.stringify(allData, null, 2), {
                headers: {
                    "Content-Type": "application/json",
                    "Content-Disposition": `attachment; filename="${botId}_export_${new Date().toISOString().split('T')[0]}.json"`,
                },
            });
        }
    } catch (error: any) {
        console.error("Export error:", error);
        return NextResponse.json(
            { error: error.message || "Export failed" },
            { status: 500 }
        );
    }
}
