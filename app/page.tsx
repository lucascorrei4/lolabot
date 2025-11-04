import ChatWidget from "../components/chat/ChatWidget";

export default function HomePage() {
  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", gap: 40, padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>LolaBot</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>Next.js + TypeScript scaffold is ready.</p>
        <div style={{ marginTop: 40 }}>
          <ChatWidget botId="lola-demo" />
        </div>
      </div>
    </main>
  );
}


