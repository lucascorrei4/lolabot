import { listMessages, getSessionById } from "../../../lib/db/mongo";
import Link from "next/link";
import { AdminSidebar } from "../../../components/admin/AdminSidebar";
import { LiveChatViewer } from "../../../components/chat/LiveChatViewer";

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

  // Serialize session for client component
  const serializedSession = session ? {
    _id: session._id?.toString() || id,
    botId: session.botId,
    userId: session.userId,
    chatId: session.chatId,
    userEmail: (session as any).userEmail,
    userName: (session as any).userName,
    createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
    lastActivityAt: session.lastActivityAt instanceof Date
      ? session.lastActivityAt.toISOString()
      : session.lastActivityAt,
  } : null;

  // Create a proper Back link using the Admin flow
  const backLink = (session?.botId ? `/admin/${session.botId}/logs` : "/") as any;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex font-sans">
      {session?.botId && <AdminSidebar botId={session.botId} />}

      <main className={`flex-1 ${session?.botId ? 'lg:ml-64' : ''} flex flex-col min-h-screen bg-gray-900 pt-16 lg:pt-0`}>
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 py-4 lg:py-6 px-4 lg:px-8 lg:sticky lg:top-0 z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-lg lg:text-2xl font-bold text-white">Conversation History</h2>
            <p className="text-gray-400 mt-1 text-xs lg:text-sm truncate">
              Session: <span className="font-mono">{id.slice(0, 8)}...</span> • User: <span className="text-gray-200">{session?.userId || "Anonymous"}</span>
            </p>
          </div>
          <Link
            href={backLink}
            className="px-3 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Logs
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
          <LiveChatViewer
            sessionId={id}
            initialMessages={serializedMessages}
            session={serializedSession}
            botId={session?.botId || ''}
            timezone={process.env.NEXT_PUBLIC_TIMEZONE}
          />
        </div>

        {/* Inject CSS vars for MessageList compatibility - Always dark mode */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
                --text-primary: #e5e7eb;
                --text-secondary: #9ca3af;
                --bot-bubble: #374151;
            }
            `
        }} />
      </main>
    </div>
  );
}
