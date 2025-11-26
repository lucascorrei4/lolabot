import { notFound } from "next/navigation";
import ChatWidget from "../../components/chat/ChatWidget";
import { env } from "../../lib/env";

export default async function BotSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Check if the slug matches the configured BOT_SLUG
  if (slug !== env.NEXT_PUBLIC_BOT_SLUG) {
    notFound();
  }

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", gap: 40, padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{env.NEXT_PUBLIC_BOT_TITLE}</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>{env.NEXT_PUBLIC_BOT_DESCRIPTION}</p>
        <div style={{ marginTop: 40 }}>
          <ChatWidget botId="lola-demo" />
        </div>
      </div>
    </main>
  );
}

