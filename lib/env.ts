import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Bot identification variables (used for display purposes, actual config comes from MongoDB)
  NEXT_PUBLIC_BOT_TITLE: z.string().default("LolaBot"),
  NEXT_PUBLIC_BOT_DESCRIPTION: z.string().default("LolaBot Intelligence"),
  NEXT_PUBLIC_BOT_SHORTNAME: z.string().default("LolaBot"),
  NEXT_PUBLIC_BOT_SLUG: z.string().default("lola-intelligence"),
  NEXT_PUBLIC_INITIAL_GREETING: z.string().optional(),

  // Legacy webhook URL (only used if no bot configs in MongoDB)
  WEBHOOK_OUTGOING_URL: z.string().url().optional(),

  WEBHOOK_SIGNATURE_SECRET: z.preprocess((val) => (val === "" ? undefined : val), z.string().min(16).optional()),

  MONGODB_URI: z.string().url(),
  MONGODB_DB: z.string().min(1),

  STORAGE_PROVIDER: z.enum(["S3", "R2"]).default("S3"),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1).optional(),
  S3_ENDPOINT: z.string().url().optional(),
  R2_PUBLIC_URL: z.string().url().optional(), // Public development URL for R2 (e.g., https://pub-xxx.r2.dev)
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  EMBED_ALLOWED_ORIGINS: z.string().optional(),

  // SMTP Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

function parseEnv() {
  // Safe parsing: if validation fails, we log warnings but don't crash the build 
  // unless it's a runtime execution.
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const details = Object.entries(flattened)
      .map(([k, v]) => `${k}: ${v?.join(", ")}`)
      .join("\n");

    console.error(`Invalid environment variables:\n${details}`);

    // If in production build context, allow build to succeed
    if (process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn("Returning partial env for build phase...");
      return process.env as any;
    }

    throw new Error(`Invalid environment variables:\n${details}`);
  }
  return parsed.data;
}

export const env = parseEnv();

export function getAllowedOrigins(): string[] {
  if (!env.EMBED_ALLOWED_ORIGINS) return [];
  return env.EMBED_ALLOWED_ORIGINS.split(",").map((s: string) => s.trim()).filter(Boolean);
}

// Re-export async bot config helpers for convenience
export {
  getBotsConfigAsync,
  getBotByIdAsync,
  getBotBySlugAsync,
  getDefaultBotAsync
} from "./botConfig";
