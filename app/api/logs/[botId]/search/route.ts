import { NextResponse } from 'next/server';
import { listSessions } from '../../../../../lib/db/mongo';

export async function GET(request: Request, { params }: { params: Promise<{ botId: string }> }) {
    const { botId } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    // Reuse the listSessions logic but search
    const sessions = await listSessions(5, 0, botId, undefined, undefined, query);

    const results = sessions.map(s => ({
        id: s._id?.toString(),
        userId: s.userId || "Anonymous",
        lastActivity: s.lastActivityAt || s.createdAt
    }));

    return NextResponse.json({ results });
}
