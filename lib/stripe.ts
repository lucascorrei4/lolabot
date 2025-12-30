import Stripe from 'stripe';

// Validate Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.error('⚠️ WARNING: STRIPE_SECRET_KEY is not set. Stripe payments will not work.');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder');

// Product details for BizAI Agent
export const PRODUCTS = {
    setup: {
        name: 'BizAI Agent - Initial Setup & Configuration',
        description: 'One-time custom implementation by our team. Includes: Custom BizAI Agent Configuration, Context-Aware Integration, Real-time Sentiment Analysis, Emergency Notification System, Briefing Summaries setup, and full onboarding.',
        price: 997 * 100, // $997 in cents
        mode: 'payment' as const,
        currency: 'usd',
    },
    monthly: {
        name: 'BizAI Agent - Monthly Support & Maintenance',
        description: 'Ongoing AI hosting, unlimited conversations, token usage, maintenance, priority support, and continuous optimization of your AI sales agent.',
        price: 199 * 100, // $199 in cents
        mode: 'subscription' as const,
        currency: 'usd',
    },
    bundle: {
        name: 'BizAI Agent - Complete Bundle',
        description: 'Get started with BizAI Agent! Includes Initial Setup & Configuration ($997) plus first month of Support & Maintenance ($199). Total value: $1,196.',
        setupPrice: 997 * 100,
        monthlyPrice: 199 * 100,
        currency: 'usd',
    },
};

export type ProductType = 'setup' | 'monthly' | 'bundle';

export interface CreateCheckoutParams {
    productType: ProductType;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
}

/**
 * Create a Stripe Checkout Session dynamically
 */
export async function createCheckoutSession({
    productType,
    customerEmail,
    successUrl,
    cancelUrl,
}: CreateCheckoutParams): Promise<Stripe.Checkout.Session> {
    const product = PRODUCTS[productType];

    if (productType === 'bundle') {
        // Bundle: Create a subscription with setup fee
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: 'BizAI Agent - Initial Setup & Configuration',
                            description: 'One-time setup fee for custom implementation',
                        },
                        unit_amount: PRODUCTS.bundle.setupPrice,
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: 'BizAI Agent - Monthly Support & Maintenance',
                            description: 'Recurring monthly fee for hosting, support, and maintenance',
                        },
                        unit_amount: PRODUCTS.bundle.monthlyPrice,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                productType: 'bundle',
            },
            subscription_data: {
                trial_period_days: 30, // Monthly billing starts after 30 days
                description: 'BizAI Agent - Monthly subscription starts after 30-day trial',
            },
            allow_promotion_codes: true,
        });

        return session;
    }

    if (productType === 'monthly') {
        // Subscription for monthly plan
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: product.name,
                            description: product.description,
                        },
                        unit_amount: (product as typeof PRODUCTS.monthly).price,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                productType: 'monthly',
            },
            allow_promotion_codes: true,
        });

        return session;
    }

    // One-time payment for setup
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: customerEmail,
        line_items: [
            {
                price_data: {
                    currency: product.currency,
                    product_data: {
                        name: product.name,
                        description: product.description,
                    },
                    unit_amount: (product as typeof PRODUCTS.setup).price,
                },
                quantity: 1,
            },
        ],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
            productType: 'setup',
        },
        allow_promotion_codes: true,
    });

    return session;
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer', 'subscription'],
    });
}

/**
 * Verify webhook signature and construct event
 */
export async function constructWebhookEvent(
    payload: string | Buffer,
    signature: string
): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export default stripe;
