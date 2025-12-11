import ChatWidget from "../../../components/chat/ChatWidget";
import MessageList from "../../../components/chat/MessageList";
import { env } from "../../../lib/env";
import { listMessages, getSessionById } from "../../../lib/db/mongo";
import Link from "next/link";

export default async function ChatPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[]>> }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    const messages = await listMessages(id, 1000);
    const session = await getSessionById(id);
    const serializedMessages = messages.map(m => ({
        ...m,
        _id: m._id?.toString(),
        createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
        sessionId: m.sessionId,
    }));

    return (
        <main style={{ 
            minHeight: "100vh", 
            display: "flex", 
            flexDirection: "column", 
            backgroundColor: "var(--bg-primary)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "var(--text-primary)"
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                  --bg-primary: #f9fafb;
                  --bg-card: #ffffff;
                  --text-primary: #111827;
                  --text-secondary: #6b7280;
                  --border-color: #e5e7eb;
                  --header-bg: #ffffff;
                  --bot-bubble: #f3f4f6;
                  --link-color: #0066ff;
                }

                @media (prefers-color-scheme: dark) {
                  :root {
                    --bg-primary: #0f1115;
                    --bg-card: #1a1d24;
                    --text-primary: #e0e0e0;
                    --text-secondary: #a0a0a0;
                    --border-color: #2d2d2d;
                    --header-bg: #1a1d24;
                    --bot-bubble: #2d2d2d;
                    --link-color: #3b82f6;
                  }
                }
            `}} />
            <div style={{
                maxWidth: "800px",
                width: "100%",
                margin: "0 auto",
                backgroundColor: "var(--bg-card)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid var(--border-color)",
                borderRight: "1px solid var(--border-color)"
            }}>
                <div style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid var(--border-color)",
                    backgroundColor: "var(--header-bg)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>Conversation History</h1>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Session ID: {id}</p>
                    </div>
                    {session?.botId && (
                        <Link 
                            href={`/logs/${session.botId}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                backgroundColor: "var(--bg-primary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                color: "var(--text-primary)",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                transition: "all 0.2s"
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back to Logs
                        </Link>
                    )}
                </div>
                
                <div style={{ padding: "24px", flex: 1 }}>
                    {messages.length > 0 ? (
                        <MessageList 
                            items={serializedMessages} 
                            colors={{
                                text: "var(--text-primary)",
                                textSecondary: "var(--text-secondary)",
                                userBubble: "#0066ff",
                                botBubble: "var(--bot-bubble)",
                            }}
                        />
                    ) : (
                        <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                            No messages found for this session.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
  }

  // Fallback to ChatWidget for botId (existing behavior)
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
        botId={id} 
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
