import { listSessions, countSessions } from "../../../lib/db/mongo";
import Link from "next/link";

export default async function BotChatListPage({ params, searchParams }: { params: Promise<{ botId: string }>; searchParams: Promise<Record<string, string | string[]>> }) {
  const { botId } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const sessions = await listSessions(limit, offset, botId);
  const total = await countSessions(botId);
  const totalPages = Math.ceil(total / limit);

  return (
    <main style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--bg-primary)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px 20px",
      color: "var(--text-primary)"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-primary: #f9fafb;
          --bg-card: #ffffff;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --hover-bg: #f3f4f6;
          --link-color: #0066ff;
          --link-text: #ffffff;
          --badge-bg: #e0f2fe;
          --badge-text: #0369a1;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #0f1115; /* Darker background */
            --bg-card: #1a1d24;    /* Slightly lighter card */
            --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0;
            --border-color: #2d2d2d;
            --hover-bg: #2d2d2d;
            --link-color: #3b82f6;
            --link-text: #ffffff;
            --badge-bg: #1e3a8a;
            --badge-text: #bfdbfe;
          }
        }
      `}} />
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "24px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "24px", 
              fontWeight: 700, 
              color: "var(--text-primary)",
              margin: 0
            }}>Session Logs</h1>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-secondary)", fontSize: "14px" }}>
              Bot ID: <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{botId}</span>
            </p>
          </div>
          <div style={{
            fontSize: "14px",
            color: "var(--text-secondary)"
          }}>
            Total Sessions: {total}
          </div>
        </div>

        <div style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
          border: "1px solid var(--border-color)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-primary)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={tableHeaderStyle}>Session ID</th>
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Chat ID</th>
                <th style={tableHeaderStyle}>Last Activity</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session._id?.toString()} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>
                        {session._id?.toString().substring(0, 8)}...
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {session.userId ? (
                        <span style={{ color: "var(--text-primary)" }}>{session.userId}</span>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Anonymous</span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {session.chatId ? (
                         <span style={{ fontFamily: "monospace", color: "var(--text-primary)", fontSize: "12px" }}>
                           {session.chatId}
                         </span>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>-</span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {new Date(session.lastActivityAt || session.createdAt).toLocaleString()}
                    </td>
                    <td style={tableCellStyle}>
                      <Link 
                        href={`/chat/${session._id}`}
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          backgroundColor: "var(--link-color)",
                          color: "var(--link-text)",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "13px",
                          fontWeight: 500,
                          transition: "opacity 0.2s"
                        }}
                      >
                        View Log
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                    No sessions found for this bot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "8px", 
          marginTop: "24px" 
        }}>
          {page > 1 && (
            <Link 
              href={`/logs/${botId}?page=${page - 1}`}
              style={paginationButtonStyle}
            >
              Previous
            </Link>
          )}
          
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            padding: "0 12px", 
            fontSize: "14px", 
            color: "var(--text-secondary)" 
          }}>
            Page {page} of {totalPages || 1}
          </span>

          {page < totalPages && (
            <Link 
              href={`/logs/${botId}?page=${page + 1}`}
              style={paginationButtonStyle}
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

const tableHeaderStyle = {
  padding: "16px 24px",
  textAlign: "left" as const,
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  color: "var(--text-secondary)",
  letterSpacing: "0.05em"
};

const tableCellStyle = {
  padding: "16px 24px",
  fontSize: "14px",
  color: "var(--text-primary)"
};

const paginationButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border-color)",
  borderRadius: "6px",
  color: "var(--text-primary)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.2s",
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
};
