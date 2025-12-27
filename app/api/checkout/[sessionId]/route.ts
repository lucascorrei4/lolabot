import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession } from '../../../../lib/stripe';

// Allow cross-origin requests from landing page
const ALLOWED_ORIGINS = [
    'https://bizaigpt.com',
    'http://localhost:3001',
    'http://localhost:3000',
];

function getCorsHeaders(origin: string | null) {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

interface RouteParams {
    params: Promise<{ sessionId: string }>;
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders(origin),
    });
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const { sessionId } = await params;

    try {
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const session = await getCheckoutSession(sessionId);

        // Return relevant session details
        return NextResponse.json(
            {
                id: session.id,
                status: session.status,
                paymentStatus: session.payment_status,
                customerEmail: session.customer_details?.email || session.customer_email,
                amountTotal: session.amount_total,
                currency: session.currency,
                metadata: session.metadata,
                created: session.created,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve checkout session' },
            { status: 500, headers: corsHeaders }
        );
    }
}
