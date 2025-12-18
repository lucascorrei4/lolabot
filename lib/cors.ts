import { getAllowedOrigins } from "./env";

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return true;
  return allowed.includes(origin);
}

