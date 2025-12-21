import { listMessages, getSessionById } from "../../../lib/db/mongo";
import Link from "next/link";
import MessageList from "../../../components/chat/MessageList";
import { AdminSidebar } from "../../../components/admin/AdminSidebar";

export default async function AdminChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (!isObjectId) {
    return <div>Invalid Session ID</div>;
  }

  const messages = await listMessages(id, 1000);
  const session = await getSessionById(id);
  const serializedMessages = messages.map(m => ({
    ...m,
    _id: m._id?.toString(),
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    sessionId: m.sessionId,
  }));

  // Create a proper Back link using the Admin flow
  const backLink = session?.botId ? `/admin/${session.botId}/logs` : "/";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex font-sans">
      {session?.botId && <AdminSidebar botId={session.botId} />}

      <main className={`flex-1 ${session?.botId ? 'ml-64' : ''} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6 px-8 sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">Conversation History</h2>
            <p className="text-gray-400 mt-1 text-sm lg:text-base"> Session: {id} • User: <span className="text-gray-900 dark:text-gray-200">{session?.userId || "Anonymous"}</span></p>
          </div>
          <Link
            href={backLink}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Logs
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[500px] flex flex-col p-6">
            {messages.length > 0 ? (
              <MessageList
                items={serializedMessages}
                colors={{
                  text: "var(--text-primary)",
                  textSecondary: "var(--text-secondary)",
                  userBubble: "#4f46e5", // Indigo-600 to match admin theme
                  botBubble: "var(--bot-bubble)",
                }}
                timezone={process.env.NEXT_PUBLIC_TIMEZONE}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No messages found for this session.
              </div>
            )}
          </div>
        </div>

        {/* Inject CSS vars for MessageList compatibility */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
                --text-primary: #1f2937;
                --text-secondary: #6b7280;
                --bot-bubble: #f3f4f6;
            }
            @media (prefers-color-scheme: dark) {
                :root {
                    --text-primary: #e5e7eb;
                    --text-secondary: #9ca3af;
                    --bot-bubble: #374151; /* gray-700 */
                }
            }
            `
        }} />
      </main>
    </div>
  );
}
