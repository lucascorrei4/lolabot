'use client';

import { CheckIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

const includedFeatures = [
  'Custom BizAI Agent Configuration',
  'Context-Aware Integration',
  'Real-time Sentiment Analysis',
  'Emergency Notification System',
  'Briefing Summaries',
  'Unlimited Conversations',
];

// API URL for checkout
const CHECKOUT_API_URL = process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'http://localhost:3000';

type ProductType = 'setup' | 'monthly' | 'bundle';

export function Pricing() {
  const [loading, setLoading] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (productType: ProductType) => {
    setLoading(productType);
    setError(null);

    try {
      const response = await fetch(`${CHECKOUT_API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="bg-gray-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Simple Pricing</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Get started with a plan that fits
          </p>
        </div>

        {error && (
          <div className="mx-auto max-w-2xl mb-8">
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-10 sm:mt-16 lg:mt-20 max-w-2xl rounded-2xl sm:rounded-3xl ring-1 ring-white/10 bg-white/5 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-5 sm:p-8 lg:p-10 lg:flex-auto">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Full Service Implementation</h3>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
              Our team sets up everything based on your specific business needs, policies, and rules. We create a strong context to ensure the AI helps your clients effectively.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-xs sm:text-sm font-semibold leading-6 text-indigo-400">What's included</h4>
              <div className="h-px flex-auto bg-white/10" />
            </div>
            <ul
              role="list"
              className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-2 sm:gap-x-3">
                  <CheckIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-xl sm:rounded-2xl bg-gray-900/50 py-8 sm:py-10 text-center ring-1 ring-inset ring-white/10 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-6 sm:px-8">
                <p className="text-sm sm:text-base font-semibold text-gray-400">Initial Setup & Configuration</p>
                <p className="mt-4 sm:mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">$997</span>
                  <span className="text-xs sm:text-sm font-semibold leading-6 tracking-wide text-gray-400">USD</span>
                </p>
                <p className="mt-2 text-[10px] sm:text-xs leading-5 text-gray-500">one-time payment</p>

                <div className="mt-6 sm:mt-8 border-t border-white/10 pt-6 sm:pt-8">
                  <p className="text-sm sm:text-base font-semibold text-gray-400">Monthly Support & Maintenance</p>
                  <p className="mt-3 sm:mt-4 flex items-baseline justify-center gap-x-2">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">$199</span>
                    <span className="text-xs sm:text-sm font-semibold leading-6 tracking-wide text-gray-400">/mo</span>
                  </p>
                </div>

                {/* Main Bundle CTA */}
                <button
                  onClick={() => handleCheckout('bundle')}
                  disabled={loading !== null}
                  className="mt-8 sm:mt-10 block w-full rounded-md bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'bundle' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Get Started Now'
                  )}
                </button>

                <p className="mt-6 text-[10px] sm:text-xs leading-5 text-gray-500">
                  Secure payment via Stripe. Invoices and receipts available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
