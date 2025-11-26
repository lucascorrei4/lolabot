import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  NEXT_PUBLIC_BOT_TITLE: z.string().default("LolaBot"),
  NEXT_PUBLIC_BOT_DESCRIPTION: z.string().default("Immigration Advisor"),
  NEXT_PUBLIC_BOT_SHORTNAME: z.string().default("LolaBot"),
  NEXT_PUBLIC_BOT_SLUG: z.string().default("immigration-advisor"),

  WEBHOOK_OUTGOING_URL: z.string().url(),
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
});

function parseEnv() {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const details = Object.entries(flattened)
      .map(([k, v]) => `${k}: ${v?.join(", ")}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }
  return parsed.data;
}

export const env = parseEnv();

export function getAllowedOrigins(): string[] {
  if (!env.EMBED_ALLOWED_ORIGINS) return [];
  return env.EMBED_ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
}


