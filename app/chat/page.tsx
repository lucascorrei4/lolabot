import { getDefaultBotAsync } from "../../lib/env";
import { env } from "../../lib/env";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Widget Integration | LolaBot Intelligence",
  description: "Test and integrate the LolaBot Intelligence chat widget.",
};

export default async function ChatTestPage() {
  const appUrl = env.NEXT_PUBLIC_APP_URL || "";
  // Ensure we don't have double slash if appUrl ends with /
  const baseUrl = appUrl.replace(/\/$/, "");
  const scriptSrc = `${baseUrl}/embed/lolabot.js`;
  const defaultBot = await getDefaultBotAsync();
  const botId = defaultBot?.id || "lolabot-landing-demo";

  const codeSnippet = `<script 
  src="${scriptSrc}"
  data-bot-id="${botId}"
  data-user-id="user-123"
  data-theme="dark"
></script>`;

  return (
    <main style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Chat Widget Integration</h1>
        <p style={styles.description}>
          This page demonstrates how the chat widget appears on an external website.
          Use the code below to integrate the widget into your own site.
        </p>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Integration Code</h2>
          </div>
          <div style={styles.codeBlockWrapper}>
            <pre style={styles.codeBlock}>{codeSnippet}</pre>
          </div>
          <p style={styles.note}>
            Paste this snippet before the closing <code>&lt;/body&gt;</code> tag.
          </p>
        </div>
      </div>

      <Script
        src={scriptSrc}
        data-bot-id={botId}
        data-user-id="lolabot-landing-demo-user"
        data-theme="dark"
        strategy="afterInteractive"
      />
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#111827", // Gray-900
    padding: "2rem",
    color: "#f9fafb", // Gray-50
  },
  content: {
    maxWidth: "42rem", // max-w-2xl
    width: "100%",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "700",
    marginBottom: "1rem",
    letterSpacing: "-0.025em",
  },
  description: {
    fontSize: "1.125rem",
    color: "#9ca3af", // Gray-400
    marginBottom: "2.5rem",
    lineHeight: "1.75",
  },
  card: {
    backgroundColor: "#1f2937", // Gray-800
    borderRadius: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    border: "1px solid #374151", // Gray-700
    textAlign: "left" as const,
  },
  cardHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #374151", // Gray-700
    backgroundColor: "#111827", // Gray-900
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#e5e7eb", // Gray-200
    margin: 0,
  },
  codeBlockWrapper: {
    padding: "0",
    backgroundColor: "#000000", // Black for contrast
    overflowX: "auto" as const,
  },
  codeBlock: {
    margin: 0,
    padding: "1.5rem",
    color: "#f3f4f6", // Gray-100
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "0.875rem",
    lineHeight: "1.7",
  },
  note: {
    padding: "1rem 1.5rem",
    fontSize: "0.875rem",
    color: "#9ca3af", // Gray-400
    margin: 0,
    borderTop: "1px solid #374151", // Gray-700
  }
};
