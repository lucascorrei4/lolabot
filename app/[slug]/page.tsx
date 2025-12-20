import { notFound } from "next/navigation";
import { Metadata } from "next";
import ChatWidget from "../../components/chat/ChatWidget";
import { getBotBySlugAsync } from "../../lib/env";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bot = await getBotBySlugAsync(slug);
  return {
    title: bot?.shortName || "LolaBot",
  };
}

export default async function BotSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = await getBotBySlugAsync(slug);

  if (!bot) {
    notFound();
  }

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", gap: 40, padding: 20, backgroundColor: "#111827", color: "#f3f4f6" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, color: "#f3f4f6" }}>{bot.title}</h1>
        <p style={{ color: "#9ca3af", marginBottom: 24 }}>{bot.description}</p>
        <div style={{ marginTop: 40 }}>
          <ChatWidget
            botId={bot.id}
            title={bot.title}
            description={bot.description}
            shortName={bot.shortName}
            initialGreeting={bot.initialGreeting}
            theme="dark"
          />
        </div>
      </div>
    </main>
  );
}

