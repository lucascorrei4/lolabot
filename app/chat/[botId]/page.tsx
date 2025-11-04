import ChatWidget from "../../../components/chat/ChatWidget";

export default function ChatPage({ params, searchParams }: { params: { botId: string }; searchParams: Record<string, string | string[]> }) {
  const apiBase = typeof searchParams.apiBase === "string" ? searchParams.apiBase : "";
  const userId = typeof searchParams.userId === "string" ? searchParams.userId : undefined;
  const chatId = typeof searchParams.chatId === "string" ? searchParams.chatId : undefined;
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ChatWidget botId={params.botId} apiBase={apiBase} userId={userId} chatId={chatId} />
    </main>
  );
}


