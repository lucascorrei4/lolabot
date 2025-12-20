import { redirect } from "next/navigation";
import { getDefaultBot } from "../lib/env";

// Sanitize URL path to remove invalid characters for HTTP headers
function sanitizeUrlPath(path: string): string {
  // Remove any characters that are invalid in HTTP headers
  // This includes control characters, newlines, carriage returns, etc.
  return path.replace(/[\x00-\x1F\x7F\r\n]/g, '').trim();
}

export default function HomePage() {
  const defaultBot = getDefaultBot();
  if (defaultBot) {
    const sanitizedSlug = sanitizeUrlPath(defaultBot.slug);
    redirect(`/${sanitizedSlug}`);
  } else {
    // Fallback if no bots configured
    redirect("/lolabot-landing-demo");
  }
}
