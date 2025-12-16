import { redirect } from "next/navigation";
import { getDefaultBot } from "../lib/env";

export default function HomePage() {
  const defaultBot = getDefaultBot();
  if (defaultBot) {
    redirect(`/${defaultBot.slug}`);
  } else {
    // Fallback if no bots configured
    redirect("/immigration-advisor");
  }
}
