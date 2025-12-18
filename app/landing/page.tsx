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
      <Story />
      <NotificationShowcase />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
