import type { Metadata } from 'next';
import { Hero } from '../Hero';
import { Features } from '../Features';
import { Pricing } from '../Pricing';
import { Footer } from '../Footer';
import { Story } from '../Story';
import { HowItWorks } from '../HowItWorks';
import { FAQ } from '../FAQ';
import { LolaBotIntegration } from '../LolaBotIntegration';
import { BriefingShowcase } from '../BriefingShowcase';
import { LogsShowcase } from '../LogsShowcase';
import { LeadScoringShowcase } from '../LeadScoringShowcase';

export const metadata: Metadata = {
    title: 'Lolabot - Smart AI Agent for Your Website',
    description: 'Transform your website with Lolabot. A context-aware BizAI agent that provides summaries, emergency alerts, and intelligent customer support.',
    openGraph: {
        title: 'Lolabot - Smart AI Agent',
        description: 'Context-aware BizAI agent for modern businesses.',
        type: 'website',
    },
};

// Comprehensive JSON-LD Schema for AEO (Answer Engine Optimization)
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://bizaigpt.com/#organization",
            "name": "LolaBot",
            "alternateName": "BizAI",
            "url": "https://bizaigpt.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://bizaigpt.com/assets/img/favicon.png",
                "width": 512,
                "height": 512
            },
            "sameAs": [
                "https://twitter.com/bizaigpt"
            ],
            "description": "LolaBot provides full-service AI chatbot implementation for businesses. Unlike DIY chatbots, we custom-configure every aspect of your AI sales agent.",
            "foundingDate": "2024",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "email": "info@bizaigpt.com",
                "availableLanguage": ["English", "Portuguese"]
            }
        },
        {
            "@type": "Product",
            "@id": "https://bizaigpt.com/#product",
            "name": "LolaBot AI Sales Agent",
            "description": "Full-service AI chatbot implementation with custom configuration, real-time lead scoring, smart email briefings, and 24/7 automated customer engagement. Our team handles everything - no DIY setup required.",
            "brand": {
                "@id": "https://bizaigpt.com/#organization"
            },
            "category": "Business Software",
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "199",
                "highPrice": "997",
                "offerCount": "2",
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Initial Setup & Configuration",
                        "price": "997",
                        "priceCurrency": "USD",
                        "description": "One-time custom implementation by our team based on your business needs, policies, and rules",
                        "availability": "https://schema.org/InStock"
                    },
                    {
                        "@type": "Offer",
                        "name": "Monthly Support & Maintenance",
                        "price": "199",
                        "priceCurrency": "USD",
                        "description": "Ongoing hosting, AI token usage, maintenance, and priority support",
                        "availability": "https://schema.org/InStock"
                    }
                ]
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "47",
                "bestRating": "5",
                "worstRating": "1"
            },
            "additionalProperty": [
                {
                    "@type": "PropertyValue",
                    "name": "Context Awareness",
                    "value": "AI understands which page the visitor is on and adapts responses accordingly"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Lead Scoring",
                    "value": "Automatic scoring based on buying signals like pricing questions, timeline, and budget"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Smart Briefings",
                    "value": "Daily email summaries of important conversations and action items"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Emergency Alerts",
                    "value": "Instant notifications for frustrated customers or urgent requests"
                }
            ]
        },
        {
            "@type": "WebSite",
            "@id": "https://bizaigpt.com/#website",
            "url": "https://bizaigpt.com",
            "name": "LolaBot",
            "publisher": {
                "@id": "https://bizaigpt.com/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://bizaigpt.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
    ]
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gray-900">
            {/* Comprehensive Schema.org JSON-LD for AEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LolaBotIntegration />
            <Hero />
            <Story />
            <LeadScoringShowcase />
            <div className="space-y-12">
                <BriefingShowcase type="warning" />
                <BriefingShowcase type="danger" />
            </div>
            <LogsShowcase />
            <Features />
            <HowItWorks />
            <Pricing />
            <FAQ />
            <Footer />
        </main>
    );
}
