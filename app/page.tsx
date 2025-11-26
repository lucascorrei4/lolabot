import { redirect } from "next/navigation";
import { env } from "../lib/env";

export default function HomePage() {
  redirect(`/${env.NEXT_PUBLIC_BOT_SLUG}`);
}
