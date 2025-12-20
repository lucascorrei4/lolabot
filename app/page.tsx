import { redirect } from "next/navigation";
import { getDefaultBotAsync } from "../lib/env";

// Sanitize URL path to remove invalid characters for HTTP headers
function sanitizeUrlPath(path: string): string {
  // Remove any characters that are invalid in HTTP headers
  // This includes control characters, newlines, carriage returns, etc.
  return path.replace(/[\x00-\x1F\x7F\r\n]/g, '').trim();
}

export default async function HomePage() {
  const defaultBot = await getDefaultBotAsync();
  if (defaultBot) {
    const sanitizedSlug = sanitizeUrlPath(defaultBot.slug);
    redirect(`/${sanitizedSlug}`);
  } else {
    // Fallback if no bots configured
    redirect("/login");
  }
}
