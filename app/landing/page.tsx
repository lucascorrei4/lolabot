import type { Metadata } from 'next';
import { Hero } from '../../landing/Hero';
import { Features } from '../../landing/Features';
import { Pricing } from '../../landing/Pricing';
import { Footer } from '../../landing/Footer';
import { Story } from '../../landing/Story';
import { HowItWorks } from '../../landing/HowItWorks';
import { FAQ } from '../../landing/FAQ';
import { NotificationShowcase } from '../../landing/NotificationShowcase';
import { LolaBotIntegration } from '../../landing/LolaBotIntegration';

export const metadata: Metadata = {
  title: 'LolaBot Intelligence - Smart AI Agent for Your Website',
  description: 'Transform your website with LolaBot Intelligence. A context-aware BizAI agent that provides summaries, emergency alerts, and intelligent customer support.',
  openGraph: {
    title: 'LolaBot Intelligence - Smart AI Agent',
    description: 'Context-aware BizAI agent for modern businesses.',
    type: 'website',
  },
};

import { BriefingShowcase } from '../../landing/BriefingShowcase';
import { LogsShowcase } from '../../landing/LogsShowcase';

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LolaBot Intelligence',
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
