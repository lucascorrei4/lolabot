export type MessageRole = "user" | "bot" | "system";
export type MessageType = "text" | "image" | "audio" | "choice";

export interface BotConfig {
  id: string; // Unique bot identifier (e.g., "lola-demo", "comiva-bot")
  slug: string; // URL slug (e.g., "immigration-advisor", "comiva-ai-resgate-e-estoque")
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
