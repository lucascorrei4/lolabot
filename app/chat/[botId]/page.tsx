import ChatWidget from "../../../components/chat/ChatWidget";

export default async function ChatPage({ params, searchParams }: { params: Promise<{ botId: string }>; searchParams: Promise<Record<string, string | string[]>> }) {
  const { botId } = await params;
  const resolvedSearchParams = await searchParams;

  const apiBase = typeof resolvedSearchParams.apiBase === "string" ? resolvedSearchParams.apiBase : "";
  const userId = typeof resolvedSearchParams.userId === "string" ? resolvedSearchParams.userId : undefined;
  const chatId = typeof resolvedSearchParams.chatId === "string" ? resolvedSearchParams.chatId : undefined;
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ChatWidget botId={botId} apiBase={apiBase} userId={userId} chatId={chatId} />
    </main>
  );
}


