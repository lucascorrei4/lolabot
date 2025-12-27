import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, ProductType } from '../../../lib/stripe';

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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders(origin),
    });
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        const body = await request.json();
        const { productType, customerEmail, successUrl, cancelUrl } = body;

        // Validate product type
        if (!productType || !['setup', 'monthly', 'bundle'].includes(productType)) {
            return NextResponse.json(
                { error: 'Invalid product type. Must be "setup", "monthly", or "bundle".' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate URLs
        if (!successUrl || !cancelUrl) {
            return NextResponse.json(
                { error: 'Success URL and Cancel URL are required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Create checkout session
        const session = await createCheckoutSession({
            productType: productType as ProductType,
            customerEmail,
            successUrl,
            cancelUrl,
        });

        return NextResponse.json(
            {
                sessionId: session.id,
                url: session.url,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500, headers: corsHeaders }
        );
    }
}
