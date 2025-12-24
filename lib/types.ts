export type MessageRole = "user" | "bot" | "system";
export type MessageType = "text" | "image" | "audio" | "choice";

export interface BotConfig {
  id: string; // Unique bot identifier (e.g., "lolabot-landing-demo", "my-bot")
  slug: string; // URL slug (e.g., "lola-bot", "my-smart-bot")
  title: string;
  description: string;
  shortName: string;
  initialGreeting?: string;
  webhookOutgoingUrl: string;
}

export interface Session {
  _id?: string;
  botId: string;
  userId?: string;
  chatId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  meta?: Record<string, unknown>;
}

export interface Message {
  _id?: string;
  sessionId: string;
  role: MessageRole;
  type: MessageType;
  text?: string;
  url?: string;
  mime?: string;
  choices?: Array<{ label: string; value: string }>;
  createdAt: Date;
}

export interface Upload {
  _id?: string;
  sessionId: string;
  url: string;
  key: string;
  mime: string;
  size: number;
  createdAt: Date;
}

export interface Signal {
  _id?: string;
  botId: string;
  sessionId?: string;
  type: 'success' | 'warning' | 'danger';
  title: string;
  priority: string;
  summaryTitle: string;
  summaryText: string;
  sentimentLabel: string;
  sentimentScore: string;
  sentimentIcon: string;
  actionLabel: string;
  actionText: string;
  // Lead scoring fields
  leadScore?: number; // 0-100 score
  estimatedValue?: number; // Estimated deal value in USD
  buyingSignals?: string[]; // List of detected buying signals
  userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string; // e.g. "Acme Corp"
  };
  createdAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  role: 'super_admin' | 'user';
  allowedBotIds: string[]; // List of botIds this user can access
  createdAt: Date;
  updatedAt: Date;
}

export interface Otp {
  _id?: string;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface BotSettings {
  _id?: string;
  botId: string;
  title: string;
  description: string;
  shortName: string;
  slug: string;
  initialGreeting?: string;
  webhookOutgoingUrl: string; // Webhook URL for the bot
  systemPrompt?: string; // AI system prompt (super admin only)
  pageContexts?: Record<string, string>; // Page path to context description mapping (super admin only)
  notificationEmail?: string;
  timezone?: string;
  createdAt?: Date;
  updatedAt: Date;
  updatedBy: string; // email of admin who updated
}

// Global settings for the entire LolaBot platform (super admin only)
export interface GlobalSettings {
  _id?: string;
  key: string; // Unique identifier for the setting (e.g., 'default_system_prompt')
  value: string; // The actual value
  description?: string; // Human-readable description
  updatedAt: Date;
  updatedBy: string; // email of super admin who updated
}

// Blog post for SEO content marketing
export interface BlogPost {
  _id?: string;
  slug: string; // URL-friendly identifier (unique)
  title: string; // SEO title (50-60 chars ideal)
  description: string; // Meta description (150-160 chars)
  content: string; // Markdown content
  publishedAt: Date; // Publication date
  updatedAt?: Date; // Last update date
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  category: 'ai-automation' | 'lead-generation' | 'customer-support' | 'case-studies' | 'product-updates';
  tags: string[]; // Keywords/tags for the post
  readingTime: number; // Estimated minutes to read
  featured?: boolean; // Featured posts appear in hero section
  image?: string; // Featured image URL
  status: 'draft' | 'published' | 'archived';
  seo?: {
    targetKeyword?: string; // Primary keyword targeting
    metaTitle?: string; // Override for meta title
    metaDescription?: string; // Override for meta description
    canonicalUrl?: string; // Canonical URL if different
  };
  createdAt: Date;
}
