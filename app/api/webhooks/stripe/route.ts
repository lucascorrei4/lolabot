import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '../../../../lib/stripe';
import Stripe from 'stripe';

// Disable body parsing, need raw body for webhook verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            console.error('Missing Stripe signature');
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = await constructWebhookEvent(body, signature);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('✅ Payment successful:', {
                    sessionId: session.id,
                    customerEmail: session.customer_details?.email || session.customer_email,
                    amountTotal: session.amount_total,
                    productType: session.metadata?.productType,
                });

                // Here you could:
                // 1. Create a new user/client record in MongoDB
                // 2. Send a welcome email
                // 3. Trigger onboarding workflow
                // 4. Create a new bot configuration

                // For now, we just log the successful payment
                // You can extend this to integrate with your business logic
                break;
            }

            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('📅 Subscription created:', {
                    subscriptionId: subscription.id,
                    customerId: subscription.customer,
                    status: subscription.status,
                });
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('🔄 Subscription updated:', {
                    subscriptionId: subscription.id,
                    status: subscription.status,
                });
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('❌ Subscription cancelled:', {
                    subscriptionId: subscription.id,
                    customerId: subscription.customer,
                });
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('💰 Invoice paid:', {
                    invoiceId: invoice.id,
                    customerId: invoice.customer,
                    amountPaid: invoice.amount_paid,
                });
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('⚠️ Invoice payment failed:', {
                    invoiceId: invoice.id,
                    customerId: invoice.customer,
                });
                // Here you could send a notification email about failed payment
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
