export type MessageRole = "user" | "bot" | "system";
export type MessageType = "text" | "image" | "audio" | "choice";

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


