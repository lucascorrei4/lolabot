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
import { AnimatedEmailShowcase } from '../../landing/AnimatedEmailShowcase';

export const metadata: Metadata = {
  title: 'LolaBot Intelligence - AI Chatbot That Never Misses a Lead | 24/7 Smart Support',
  description: 'Stop losing leads while you sleep. LolaBot is an AI-powered chatbot that monitors conversations 24/7, detects urgency and opportunities, and sends you instant email briefings with sentiment analysis and recommended actions.',
  keywords: ['AI chatbot', 'customer support automation', 'lead generation', 'sentiment analysis', 'business intelligence', 'real-time notifications', 'emergency alerts'],
  openGraph: {
    title: 'LolaBot Intelligence - Never Miss Another Lead',
    description: 'AI-powered chatbot with real-time intelligence. Get instant email briefings with sentiment analysis, urgency detection, and recommended actions.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LolaBot Intelligence Dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LolaBot Intelligence - AI That Works While You Sleep',
    description: 'Stop losing leads. Get instant AI-powered briefings for every conversation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { BriefingShowcase } from '../../landing/BriefingShowcase';
import { LogsShowcase } from '../../landing/LogsShowcase';
import { LeadScoringShowcase } from '../../landing/LeadScoringShowcase';

export default function LandingPage() {
  // Comprehensive JSON-LD for rich search snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // Main Product/Software Application
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://lolabot.ai/#software',
        name: 'LolaBot Intelligence',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'AI Chatbot & Customer Intelligence',
        operatingSystem: 'Web, Cloud-based',
        description: 'AI-powered chatbot that monitors customer conversations 24/7, detects urgency and opportunities, analyzes sentiment, and delivers instant email briefings with recommended actions.',
        featureList: [
          'Real-time conversation monitoring',
          'AI sentiment analysis',
          'Urgency and opportunity detection',
          'Instant email notifications',
          'Recommended action suggestions',
          'Emergency escalation alerts',
          '24/7 automated intelligence',
          'Context-aware responses'
        ],
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '49',
          highPrice: '499',
          priceCurrency: 'USD',
          offerCount: 3,
          offers: [
            { '@type': 'Offer', name: 'Starter', price: '49', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Professional', price: '199', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Enterprise', price: '499', priceCurrency: 'USD' }
          ]
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '127'
        },
        screenshot: '/screenshots/dashboard.png',
        softwareHelp: { '@type': 'CreativeWork', url: '/docs' }
      },
      // Organization
      {
        '@type': 'Organization',
        '@id': 'https://lolabot.ai/#organization',
        name: 'LolaBot Intelligence',
        url: 'https://lolabot.ai',
        logo: '/logo.png',
        sameAs: [
          'https://twitter.com/lolabot_ai',
          'https://linkedin.com/company/lolabot'
        ]
      },
      // WebPage
      {
        '@type': 'WebPage',
        '@id': 'https://lolabot.ai/landing',
        name: 'LolaBot Intelligence - AI Chatbot That Never Misses a Lead',
        description: 'Transform your customer support with AI-powered real-time intelligence',
        isPartOf: { '@id': 'https://lolabot.ai/#website' },
        about: { '@id': 'https://lolabot.ai/#software' },
        mainEntity: { '@id': 'https://lolabot.ai/#software' }
      },
      // Key Features as ItemList (enhances rich snippets)
      {
        '@type': 'ItemList',
        name: 'LolaBot Key Capabilities',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Real-Time Intelligence',
            description: 'Every conversation is analyzed instantly for sentiment, urgency, and opportunity'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Instant Email Briefings',
            description: 'Receive complete summaries with context, sentiment scores, and recommended actions'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Emergency Escalation',
            description: 'Critical issues trigger immediate alerts to your team—no delays, no missed emergencies'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: '24/7 Lead Monitoring',
            description: 'Never miss a sales opportunity—AI works while you sleep to capture every lead'
          }
        ]
      }
    ]
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
      {/* Lead Scoring Demo - Shows how AI scores leads in real-time */}
      <LeadScoringShowcase />
      {/* Animated Email Intelligence Showcase - Shows real-time email notifications */}
      <AnimatedEmailShowcase />
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
