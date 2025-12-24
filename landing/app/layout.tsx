import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LolaBotIntegration } from "../LolaBotIntegration";

const siteUrl = "https://bizaigpt.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LolaBot - AI-Powered Sales Agent for Your Website | 24/7 Lead Conversion",
    template: "%s | LolaBot",
  },
  description: "Transform website visitors into qualified leads with LolaBot's AI sales agent. Real-time lead scoring, smart email briefings, and 24/7 automated customer engagement. Start converting more leads today.",
  keywords: [
    "AI chatbot",
    "sales automation",
    "lead generation",
    "website chatbot",
    "AI sales agent",
    "lead scoring",
    "customer engagement",
    "business automation",
    "conversational AI",
    "SaaS chatbot",
    "B2B lead generation",
    "AI customer support",
  ],
  authors: [{ name: "BizAI" }],
  creator: "BizAI",
  publisher: "BizAI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/img/favicon.png",
    apple: "/assets/img/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LolaBot",
    title: "LolaBot - AI-Powered Sales Agent for Your Website",
    description: "Transform website visitors into qualified leads. Real-time lead scoring, smart briefings, and 24/7 automated engagement.",
    images: [
      {
        url: "/assets/img/og-image.png",
        width: 1200,
        height: 630,
        alt: "LolaBot - AI Sales Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LolaBot - AI-Powered Sales Agent",
    description: "Transform website visitors into qualified leads with AI-powered sales automation.",
    images: ["/assets/img/og-image.png"],
    creator: "@bizaigpt",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Aggressive chunk error handling - catches errors BEFORE React loads
// This ensures users never see an error page on deployment cache mismatch
const chunkErrorHandler = `
(function() {
  var hasReloaded = sessionStorage.getItem('chunk_reload');
  
  window.addEventListener('error', function(e) {
    var msg = e.message || '';
    var isChunkError = msg.indexOf('ChunkLoadError') > -1 ||
      msg.indexOf('Loading chunk') > -1 ||
      msg.indexOf('Failed to fetch dynamically imported module') > -1 ||
      msg.indexOf('Unexpected token') > -1 ||
      (e.filename && e.filename.indexOf('/_next/') > -1);
    
    if (isChunkError && !hasReloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
      return;
    }
  }, true);
  
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e.reason || {};
    var msg = reason.message || reason.toString() || '';
    var isChunkError = msg.indexOf('ChunkLoadError') > -1 ||
      msg.indexOf('Loading chunk') > -1 ||
      msg.indexOf('Failed to fetch dynamically imported module') > -1 ||
      msg.indexOf('Failed to load') > -1;
    
    if (isChunkError && !hasReloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      e.preventDefault();
      window.location.reload();
      return;
    }
  }, true);
  
  window.addEventListener('load', function() {
    setTimeout(function() {
      sessionStorage.removeItem('chunk_reload');
    }, 3000);
  });
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Chunk error handler - must be first to catch errors before React */}
        <script dangerouslySetInnerHTML={{ __html: chunkErrorHandler }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        {/* LolaBot chat widget - appears on all pages */}
        <LolaBotIntegration />
      </body>
    </html>
  );
}
