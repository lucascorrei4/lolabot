'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const CHECKOUT_API_URL = process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'http://localhost:3000';

interface SessionDetails {
    id: string;
    status: string;
    paymentStatus: string;
    customerEmail: string | null;
    amountTotal: number | null;
    currency: string | null;
    metadata: {
        productType?: string;
    };
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [session, setSession] = useState<SessionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        const fetchSession = async () => {
            try {
                const response = await fetch(`${CHECKOUT_API_URL}/api/checkout/${sessionId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch session');
                }

                setSession(data);
            } catch (err) {
                console.error('Error fetching session:', err);
                setError(err instanceof Error ? err.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [sessionId]);

    const formatAmount = (amount: number | null, currency: string | null) => {
        if (!amount || !currency) return '';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    const getProductName = (productType: string | undefined) => {
        switch (productType) {
            case 'setup':
                return 'Initial Setup & Configuration';
            case 'monthly':
                return 'Monthly Support & Maintenance';
            case 'bundle':
                return 'Complete Bundle (Setup + Monthly)';
            default:
                return 'BizAI Agent';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-700"></div>
                    <div className="h-6 w-48 bg-gray-700 rounded"></div>
                    <div className="h-4 w-64 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full">
                {/* Success Card */}
                <div className="bg-gray-800/50 rounded-2xl ring-1 ring-white/10 p-8 sm:p-12 text-center backdrop-blur-xl">
                    {/* Success Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-8 ring-1 ring-green-500/30">
                        <CheckCircleIcon className="h-10 w-10 text-green-400" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Payment Successful!
                    </h1>

                    {error ? (
                        <p className="text-gray-400 mb-8">
                            Your payment was processed successfully. We'll be in touch shortly!
                        </p>
                    ) : session ? (
                        <>
                            <p className="text-gray-400 mb-6">
                                Thank you for your purchase! Your order has been confirmed.
                            </p>

                            {/* Order Details */}
                            <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left ring-1 ring-white/5">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Order Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Product</span>
                                        <span className="text-white font-medium">
                                            {getProductName(session.metadata?.productType)}
                                        </span>
                                    </div>
                                    {session.amountTotal && session.currency && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Amount</span>
                                            <span className="text-white font-medium">
                                                {formatAmount(session.amountTotal, session.currency)}
                                            </span>
                                        </div>
                                    )}
                                    {session.customerEmail && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Email</span>
                                            <span className="text-white font-medium truncate max-w-[200px]">
                                                {session.customerEmail}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status</span>
                                        <span className="inline-flex items-center gap-1 text-green-400 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                            Confirmed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 mb-8">
                            Your payment was processed successfully. We'll be in touch shortly to get you set up!
                        </p>
                    )}

                    {/* What's Next */}
                    <div className="bg-indigo-500/10 rounded-xl p-6 mb-8 text-left ring-1 ring-indigo-500/20">
                        <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                            What's Next?
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">1.</span>
                                <span>Check your email for a confirmation receipt</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">2.</span>
                                <span>Our team will reach out within 24 hours to begin your onboarding</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">3.</span>
                                <span>We'll configure your custom AI agent based on your business needs</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
                    >
                        Back to Home
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>

                    {/* Contact */}
                    <p className="mt-6 text-xs text-gray-500">
                        Questions? Contact us at{' '}
                        <a href="mailto:info@bizaigpt.com" className="text-indigo-400 hover:text-indigo-300">
                            info@bizaigpt.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-700"></div>
                    <div className="h-6 w-48 bg-gray-700 rounded"></div>
                    <div className="h-4 w-64 bg-gray-800 rounded"></div>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
