import { env } from "./env";
import crypto from "crypto";

export function verifyHmac(body: string, signatureHeader: string | null): boolean {
  if (!env.WEBHOOK_SIGNATURE_SECRET) return true;
  if (!signatureHeader) return false;
  const h = crypto.createHmac("sha256", env.WEBHOOK_SIGNATURE_SECRET);
  h.update(body, "utf8");
  const expected = h.digest("hex");
  const got = signatureHeader.replace(/^sha256=/, "");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(got));
}
