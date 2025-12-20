import { NextResponse } from 'next/server';
import { insertSignal } from '../../../../lib/db/mongo';
import { Signal } from '../../../../lib/types';

export async function POST(request: Request, { params }: { params: Promise<{ botId: string }> }) {
    const { botId } = await params;

    try {
        const body = await request.json();

        // Validate required fields
        if (!body.type || !body.title || !body.summaryText) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const signal: Signal = {
            botId,
            sessionId: body.sessionId,
            type: body.type,
            title: body.title,
            priority: body.priority || 'Normal',
            summaryTitle: body.summaryTitle || 'Summary',
            summaryText: body.summaryText,
            sentimentLabel: body.sentimentLabel || 'Sentiment',
            sentimentScore: body.sentimentScore || 'N/A',
            sentimentIcon: body.sentimentIcon || '🤖',
            actionLabel: body.actionLabel || 'Action',
            actionText: body.actionText || 'Review',
            userDetails: body.userDetails,
            createdAt: new Date(),
        };

        await insertSignal(signal);

        return NextResponse.json({ success: true, signalId: signal._id });
    } catch (error) {
        console.error('Error creating signal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
