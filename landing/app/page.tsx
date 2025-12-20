import type { Metadata } from 'next';
import { Hero } from '../Hero';
import { Features } from '../Features';
import { Pricing } from '../Pricing';
import { Footer } from '../Footer';
import { Story } from '../Story';
import { HowItWorks } from '../HowItWorks';
import { FAQ } from '../FAQ';
import { LolaBotIntegration } from '../LolaBotIntegration';
import { SocialProof } from '../SocialProof';
import { BriefingShowcase } from '../BriefingShowcase';
import { LogsShowcase } from '../LogsShowcase';

export const metadata: Metadata = {
    title: 'Lolabot - Smart AI Agent for Your Website',
    description: 'Transform your website with Lolabot. A context-aware BizAI agent that provides summaries, emergency alerts, and intelligent customer support.',
    openGraph: {
        title: 'Lolabot - Smart AI Agent',
        description: 'Context-aware BizAI agent for modern businesses.',
        type: 'website',
    },
};

export default function LandingPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Lolabot',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '199',
            priceCurrency: 'USD',
        },
        description: 'Smart AI Agent with context awareness and emergency alerts.',
    };

    return (
        <main className="min-h-screen bg-gray-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LolaBotIntegration />
            <Hero />
            <SocialProof />
            <Story />
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
