import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BizAI Agent vs Intercom - AI Chatbot Comparison 2024',
    description: 'Compare BizAI Agent and Intercom side-by-side. See features, pricing, pros & cons to choose the best AI chatbot for your business.',
    openGraph: {
        title: 'BizAI Agent vs Intercom - Which AI Chatbot is Better?',
        description: 'Detailed comparison of BizAI Agent and Intercom. Find the best solution for your business.',
        type: 'website',
    },
    alternates: {
        canonical: 'https://bizaigpt.com/compare/bizai-agent-vs-intercom',
    },
};

const comparisonData = {
    features: [
        { name: 'AI-Powered Responses', bizaiAgent: true, competitor: true },
        { name: 'Lead Scoring', bizaiAgent: true, competitor: false },
        { name: 'Context-Aware Conversations', bizaiAgent: true, competitor: 'Limited' },
        { name: 'Smart Email Briefings', bizaiAgent: true, competitor: false },
        { name: 'One-Line Installation', bizaiAgent: true, competitor: false },
        { name: 'Custom Branding', bizaiAgent: true, competitor: true },
        { name: '24/7 Availability', bizaiAgent: true, competitor: true },
        { name: 'CRM Integration', bizaiAgent: 'Coming Soon', competitor: true },
        { name: 'Multi-language Support', bizaiAgent: true, competitor: true },
        { name: 'Team Inbox', bizaiAgent: true, competitor: true },
    ],
    pricing: {
        bizaiAgent: { starter: 199, growth: 399, enterprise: 'Custom' },
        competitor: { starter: 74, growth: 153, enterprise: 'Custom' },
    },
};

export default function ComparisonPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'BizAI Agent vs Intercom Comparison',
        description: 'Compare BizAI Agent and Intercom side-by-side to find the best AI chatbot solution.',
        mainEntity: {
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'Is BizAI Agent better than Intercom?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'BizAI Agent excels in lead scoring and context-aware conversations, while Intercom offers a more comprehensive suite. Choose based on your primary needs.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How much does BizAI Agent cost compared to Intercom?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'BizAI Agent starts at $199/month with all features included. Intercom starts at $74/month but costs more as you scale.',
                    },
                },
            ],
        },
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-xl font-bold text-white">
                            BizAI Agent
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition">
                                Home
                            </Link>
                            <Link href="/blog" className="text-gray-300 hover:text-white transition">
                                Blog
                            </Link>
                            <Link
                                href="/#pricing"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium mb-6">
                        Comparison Guide
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        BizAI Agent vs Intercom
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        See how BizAI Agent compares to Intercom for AI-powered customer engagement and lead generation.
                    </p>
                </div>
            </header>

            {/* Quick Comparison Cards */}
            <section className="px-4 pb-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* BizAI Agent Card */}
                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">B</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">BizAI Agent</h2>
                                <p className="text-indigo-300 text-sm">AI Sales Agent</p>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Context-aware AI conversations
                            </li>
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Built-in lead scoring
                            </li>
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Smart email briefings
                            </li>
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                One-line installation
                            </li>
                        </ul>
                        <div className="text-center pt-4 border-t border-indigo-500/30">
                            <p className="text-gray-400 text-sm mb-1">Starting at</p>
                            <p className="text-3xl font-bold text-white">$199<span className="text-lg text-gray-400">/mo</span></p>
                        </div>
                    </div>

                    {/* Intercom Card */}
                    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">I</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Intercom</h2>
                                <p className="text-gray-400 text-sm">Customer Messaging</p>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Comprehensive platform
                            </li>
                            <li className="flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Strong CRM integrations
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                No built-in lead scoring
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Complex setup required
                            </li>
                        </ul>
                        <div className="text-center pt-4 border-t border-gray-700">
                            <p className="text-gray-400 text-sm mb-1">Starting at</p>
                            <p className="text-3xl font-bold text-white">$74<span className="text-lg text-gray-400">/mo</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="px-4 py-16 bg-gray-800/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Feature-by-Feature Comparison
                    </h2>
                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                        <div className="grid grid-cols-3 bg-gray-900 border-b border-gray-700">
                            <div className="p-4 font-semibold text-white">Feature</div>
                            <div className="p-4 font-semibold text-indigo-400 text-center">BizAI Agent</div>
                            <div className="p-4 font-semibold text-gray-400 text-center">Intercom</div>
                        </div>
                        {comparisonData.features.map((feature, index) => (
                            <div
                                key={feature.name}
                                className={`grid grid-cols-3 ${index !== comparisonData.features.length - 1 ? 'border-b border-gray-700/50' : ''}`}
                            >
                                <div className="p-4 text-white">{feature.name}</div>
                                <div className="p-4 text-center">
                                    {feature.bizaiAgent === true ? (
                                        <span className="text-green-400">✓</span>
                                    ) : feature.bizaiAgent === false ? (
                                        <span className="text-red-400">✗</span>
                                    ) : (
                                        <span className="text-yellow-400">{feature.bizaiAgent}</span>
                                    )}
                                </div>
                                <div className="p-4 text-center">
                                    {feature.competitor === true ? (
                                        <span className="text-green-400">✓</span>
                                    ) : feature.competitor === false ? (
                                        <span className="text-red-400">✗</span>
                                    ) : (
                                        <span className="text-yellow-400">{feature.competitor}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* When to Choose Each */}
            <section className="px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        When to Choose Each
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-indigo-900/30 rounded-xl p-8 border border-indigo-500/30">
                            <h3 className="text-xl font-bold text-white mb-4">Choose BizAI Agent if you:</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">→</span>
                                    Need intelligent lead scoring without extra tools
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">→</span>
                                    Want context-aware conversations that understand your pages
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">→</span>
                                    Prefer simple, one-line installation
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">→</span>
                                    Value daily email briefings with key insights
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Choose Intercom if you:</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">→</span>
                                    Need a comprehensive all-in-one platform
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">→</span>
                                    Have a large support team with complex workflows
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">→</span>
                                    Already use Intercom's ecosystem
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">→</span>
                                    Budget isn't a primary concern
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 border border-indigo-500/30">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Try BizAI Agent?
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Start your free 14-day trial. No credit card required.
                        </p>
                        <Link
                            href="/#pricing"
                            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} BizAI Agent. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-400 hover:text-white text-sm transition">
                            Home
                        </Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition">
                            Blog
                        </Link>
                        <Link href="/compare/bizai-agent-vs-intercom" className="text-gray-400 hover:text-white text-sm transition">
                            Compare
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
