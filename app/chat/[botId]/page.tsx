import ChatWidget from "../../../components/chat/ChatWidget";
import { env } from "../../../lib/env";

export default async function ChatPage({ params, searchParams }: { params: Promise<{ botId: string }>; searchParams: Promise<Record<string, string | string[]>> }) {
  const { botId } = await params;
  const resolvedSearchParams = await searchParams;

  const apiBase = typeof resolvedSearchParams.apiBase === "string" ? resolvedSearchParams.apiBase : "";
  const userId = typeof resolvedSearchParams.userId === "string" ? resolvedSearchParams.userId : undefined;
  const chatId = typeof resolvedSearchParams.chatId === "string" ? resolvedSearchParams.chatId : undefined;
  
  const contextParam = typeof resolvedSearchParams.context === "string" ? resolvedSearchParams.context : undefined;
  let context = undefined;
  if (contextParam) {
    try {
      context = JSON.parse(contextParam);
    } catch (e) {
      console.error("Invalid context param:", e);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ChatWidget 
        botId={botId} 
        apiBase={apiBase} 
        userId={userId} 
        chatId={chatId}
        context={context}
        title={env.NEXT_PUBLIC_BOT_TITLE}
        description={env.NEXT_PUBLIC_BOT_DESCRIPTION}
        shortName={env.NEXT_PUBLIC_BOT_SHORTNAME}
        initialGreeting={env.NEXT_PUBLIC_INITIAL_GREETING}
      />
    </main>
  );
}


