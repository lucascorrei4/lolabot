import { notFound } from "next/navigation";
import { Metadata } from "next";
import ChatWidget from "../../components/chat/ChatWidget";
import { getBotBySlugAsync, getBotByIdAsync } from "../../lib/botConfig";
import { getBotSettings } from "../../lib/db/mongo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Try by ID first, then by slug
  let bot = await getBotByIdAsync(slug);
  if (!bot) {
    bot = await getBotBySlugAsync(slug);
  }
  return {
    title: bot?.shortName || "BizAI Agent",
  };
}

export default async function BotSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  // Try by ID first, then by slug
  let bot = await getBotByIdAsync(slug);
  if (!bot) {
    bot = await getBotBySlugAsync(slug);
  }

  if (!bot) {
    notFound();
  }

  // Get full settings for initialGreeting
  const settings = await getBotSettings(bot.id);
  const initialGreeting = settings?.initialGreeting || bot.initialGreeting;

  // Detect embed mode: if embed=true query param is present
  const isEmbed = query.embed === 'true';
  console.log(`[/slug] page: slug=${slug}, isEmbed=${isEmbed}, embed="${query.embed}"`);
  const apiBase = query.apiBase || "";
  const userId = query.userId || "";
  const chatId = query.chatId || "";
  const theme = (query.theme as "light" | "dark") || "dark";
  const contextParam = query.context;

  let context: any = null;
  if (contextParam) {
    try {
      context = JSON.parse(contextParam);
    } catch (e) {
      console.error("Failed to parse context:", e);
    }
  }

  // Embed mode: just render the ChatWidget without wrapper
  if (isEmbed) {
    return (
      <main
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "stretch",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
          color: theme === "dark" ? "#f3f4f6" : "#1f2937",
          padding: 0,
          margin: 0,
        }}
      >
        <ChatWidget
          botId={bot.id}
          apiBase={apiBase}
          userId={userId}
          chatId={chatId}
          title={bot.title}
          description={bot.description}
          shortName={bot.shortName}
          initialGreeting={initialGreeting}
          theme={theme}
          context={context}
        />
      </main>
    );
  }

  // Direct access mode: show title, description, and widget
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
            initialGreeting={initialGreeting}
            theme="dark"
          />
        </div>
      </div>
    </main>
  );
}
