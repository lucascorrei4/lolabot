"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import MessageList from "./MessageList";
import Composer from "./Composer";

type WidgetProps = {
  botId: string;
  apiBase?: string;
  userId?: string;
  chatId?: string;
  theme?: "light" | "dark";
  title?: string;
  description?: string;
  shortName?: string;
};

export default function ChatWidget(props: WidgetProps) {
  const apiBase = props.apiBase || "";
  const [session, setSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Always start with a consistent default theme to avoid hydration mismatch
  const [theme, setTheme] = useState<"light" | "dark">(props.theme || "light");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isDraggingOverChat, setIsDraggingOverChat] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const [isMaximized, setIsMaximized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Notify parent window about state changes (for embed resizing)
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ 
        type: 'LOLA_RESIZE', 
        isMaximized, 
        isCollapsed 
      }, '*');
    }
  }, [isMaximized, isCollapsed]);

  // Detect system theme preference only on client after hydration
  useEffect(() => {
    // Apply font-family to body to ensure it matches the design
    document.body.style.fontFamily = "system-ui, -apple-system, sans-serif";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    // Also ensure html is 100% height/width for full screen
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    
    // Only run if theme wasn't explicitly provided via props
    if (!props.theme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      setTheme(systemTheme);

      // Listen for theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [props.theme]);

  // Check if user is near the bottom of the scroll
  const isNearBottom = () => {
    if (!scrollerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    isProgrammaticScrollRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      setShowScrollButton(false);
    }, 300);
  };

  // Handle scroll events
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      // Don't track programmatic scrolls
      if (isProgrammaticScrollRef.current) return;
      
      if (!isUserScrollingRef.current) {
        isUserScrollingRef.current = true;
      }
      setShowScrollButton(!isNearBottom());
    };

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setError(null);
        
        // Try to get stored session ID from localStorage
        // Key includes botId so we don't mix up sessions for different bots
        const storageKey = `lolabot_session_${props.botId}${props.userId ? `_${props.userId}` : ''}`;
        const storedSessionId = localStorage.getItem(storageKey);
        
        // Determine if we should try to resume a session or create a new one
        let currentSession = null;
        
        if (storedSessionId) {
          // Verify if the stored session is still valid
          try {
             const res = await fetch(`${apiBase}/api/sessions?sessionId=${storedSessionId}`);
             // Note: We need to implement GET /api/sessions to validate/fetch session by ID
             // For now, we'll assume we can just use it if we can fetch messages
             if (res.ok) {
               // Proceed to use this session
               currentSession = { _id: storedSessionId };
             } else {
               // Session invalid or expired, clear it
               localStorage.removeItem(storageKey);
             }
          } catch (e) {
             localStorage.removeItem(storageKey);
          }
        }

        // If no valid stored session, create/resolve one via API
        if (!currentSession) {
          const res = await fetch(`${apiBase}/api/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ botId: props.botId, userId: props.userId, chatId: props.chatId }),
          });
          if (!res.ok) {
            const errorText = await res.text().catch(() => "Unknown error");
            throw new Error(`Failed to create session: ${res.status} ${errorText}`);
          }
          const json = await res.json();
          currentSession = json.session;
          
          // Store the new session ID
          if (currentSession?._id) {
            localStorage.setItem(storageKey, currentSession._id);
          }
        }
        
        setSession(currentSession);
        
        // Load existing messages for this session
        if (currentSession?._id) {
          const messagesRes = await fetch(`${apiBase}/api/messages?sessionId=${encodeURIComponent(currentSession._id)}`);
          if (messagesRes.ok) {
            const messagesJson = await messagesRes.json();
            if (messagesJson.messages) {
              setMessages(messagesJson.messages);
              // Scroll to bottom on initial load
              setTimeout(() => scrollToBottom("auto"), 100);
            }
          }
        }
      } catch (err: any) {
        console.error("Session initialization error:", err);
        setError(err.message || "Failed to initialize chat");
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [apiBase, props.botId, props.userId, props.chatId]);

  // Smart scroll handling for new messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const messageCountIncreased = messages.length > lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

            if (messageCountIncreased) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const wasNearBottom = isNearBottom();
        const lastMsg = messages[messages.length - 1];
        const isUser = lastMsg?.role === "user";

        if (isUser) {
          // User sent a message: Always scroll to bottom to show it
          scrollToBottom("smooth");
          isUserScrollingRef.current = false;
          return;
        }
        
        // Only auto-scroll if user was already near the bottom or hasn't manually scrolled
        if (wasNearBottom || !isUserScrollingRef.current) {
          isProgrammaticScrollRef.current = true;
          const lastMessageIndex = messages.length - 1;
          const lastMessage = scrollerRef.current?.querySelector(`[data-original-index="${lastMessageIndex}"]`);
          
          if (lastMessage) {
            // Scroll to show the top of the new message (so user can read from beginning)
            lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            // Fallback to bottom scroll
            scrollToBottom("smooth");
          }
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
            setShowScrollButton(false);
            // Reset user scrolling flag if they're at bottom now
            if (isNearBottom()) {
              isUserScrollingRef.current = false;
            }
          }, 300);
        } else {
          // User has scrolled up, show scroll button
          setShowScrollButton(true);
        }
      }, 50);
    }
  }, [messages.length]);

  const handleFileDrop = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("audio/")) {
      return; // Only accept images and audio
    }
    const type = file.type.startsWith("audio/") ? "audio" : "image";
    onSend({ type, file, mime: file.type });
  };

  const handleChatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading && session) {
      setIsDraggingOverChat(true);
    }
  };

  const handleChatDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the chat area (not just moving within it)
    const rect = scrollerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDraggingOverChat(false);
      }
    }
  };

  const handleChatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverChat(false);
    
    if (!session || loading) return;

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(f => f.type.startsWith("image/") || f.type.startsWith("audio/"));
    
    if (validFile) {
      handleFileDrop(validFile);
    }
  };

  const handleChatPaste = (e: React.ClipboardEvent) => {
    if (!session || loading) return;
    
    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return;

    // Check if there's an image in clipboard
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          const file = item.getAsFile();
          if (file && file.size > 0) {
            handleFileDrop(file);
          }
        } catch (error) {
          console.error("Error processing pasted image:", error);
        }
        return;
      }
    }
    // If no image, let default behavior happen
  };

  const onSend = async (payload: { type: "text" | "image" | "audio"; text?: string; url?: string; mime?: string; file?: File | null }) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    
    // Create preview URL for files (so user can see the image immediately)
    let previewUrl: string | undefined = payload.url;
    if (payload.file && !previewUrl) {
      previewUrl = URL.createObjectURL(payload.file);
    }
    
    const optimistic = { 
      role: "user", 
      type: payload.type, 
      text: payload.text, 
      url: previewUrl, // Use preview URL so image appears immediately
      mime: payload.mime || payload.file?.type, 
      _optimisticId: crypto.randomUUID(),
      _isOptimistic: true, // Mark as optimistic so we can clean up the preview URL later
    };
    setMessages((m) => [...m, optimistic]);

    try {
      let url = payload.url;
      if (payload.file) {
        const fd = new FormData();
        fd.set("file", payload.file);
        fd.set("sessionId", session._id);
        fd.set("type", payload.type);
        fd.set("mime", payload.file.type);
        const up = await fetch(`${apiBase}/api/uploads`, { method: "POST", body: fd });
        if (!up.ok) {
          throw new Error("Failed to upload file");
        }
        const uj = await up.json();
        url = uj.url;
        
        // Update optimistic message with real URL
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl); // Clean up preview URL
        }
        setMessages((m) => 
          m.map((msg) => 
            msg._optimisticId === optimistic._optimisticId 
              ? { ...msg, url, _isOptimistic: false }
              : msg
          )
        );
      }

      const res = await fetch(`${apiBase}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session._id, message: { type: payload.type, text: payload.text, url, mime: payload.mime } }),
      });
      if (!res.ok) {
        let errorMessage = `Failed to send message (${res.status})`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details && process.env.NODE_ENV === 'development') {
            console.error("Error details:", errorData.details);
          }
        } catch {
          const errorText = await res.text().catch(() => "Unknown error");
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const json = await res.json();
      if (json?.replies) setMessages((m) => [...m, ...json.replies]);
    } catch (err: any) {
      console.error("Send message error:", err);
      setError(err.message || "Failed to send message");
      // Remove optimistic message on error and clean up preview URL
      setMessages((m) => {
        const filtered = m.filter((msg) => {
          if (msg._optimisticId === optimistic._optimisticId) {
            // Clean up preview URL if it exists
            if (msg.url && typeof msg.url === 'string' && msg.url.startsWith('blob:')) {
              URL.revokeObjectURL(msg.url);
            }
            return false;
          }
          return true;
        });
        return filtered;
      });
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";
  const colors = isDark
    ? {
        bg: "#1a1a1a",
        surface: "#252525",
        surfaceElevated: "rgb(37 37 37)",
        border: "rgb(37 37 37)",
        text: "#ffffff",
        textSecondary: "#a0a0a0",
        userBubble: "#0066ff",
        botBubble: "#2d2d2d",
        inputBg: "#2d2d2d",
        error: "#ff4444",
      }
    : {
        bg: "#ffffff",
        surface: "#f8f9fa",
        surfaceElevated: "#ffffff",
        border: "#e5e7eb",
        text: "#1a1a1a",
        textSecondary: "#6b7280",
        userBubble: "#0066ff",
        botBubble: "#f1f3f5",
        inputBg: "#ffffff",
        error: "#dc2626",
      };

  return (
    <div
      style={{
        width: isMaximized ? "100%" : 380,
        height: isMaximized ? "100%" : (isCollapsed ? "auto" : 560),
        maxWidth: isMaximized ? "1440px" : "100vw",
        maxHeight: isMaximized ? "none" : "100vh",
        borderRadius: isMaximized ? 0 : 20,
        border: isMaximized || isCollapsed ? "none" : `1px solid ${colors.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: isCollapsed ? "transparent" : colors.bg,
        boxShadow: isDark
          ? "0 20px 60px rgba(0, 0, 0, 0.5)"
          : "0 20px 60px rgba(0, 0, 0, 0.12)",
        transition: "all 0.3s ease",
        position: isMaximized ? "fixed" : "relative",
        top: isMaximized ? 0 : undefined,
        left: isMaximized ? "50%" : undefined,
        transform: isMaximized ? "translateX(-50%)" : undefined,
        zIndex: isMaximized ? 9999 : undefined,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: isCollapsed ? "none" : `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isCollapsed ? "transparent" : colors.surfaceElevated,
          flex: isCollapsed ? 1 : undefined,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 16, color: colors.text }}>{props.shortName || "LolaBot"}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: 6,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textSecondary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            title="Toggle Theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              if (!isCollapsed) setIsMaximized(false);
            }}
            style={{
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: 6,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textSecondary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsMaximized(!isMaximized);
              if (!isMaximized) setIsCollapsed(false);
            }}
            style={{
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: 6,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textSecondary,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.surface)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14h6v6M20 10h-6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollerRef}
        onDragOver={handleChatDragOver}
        onDragLeave={handleChatDragLeave}
        onDrop={handleChatDrop}
        onPaste={handleChatPaste}
        tabIndex={0}
        style={{
          flex: 1,
          display: isCollapsed ? "none" : undefined,
          overflow: "auto",
          padding: 16,
          background: isDraggingOverChat ? (isDark ? "#2a3a4a" : "#e8f2ff") : colors.surface,
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.border} transparent`,
          position: "relative",
          border: isDraggingOverChat ? `2px dashed #0066ff` : `2px solid transparent`,
          transition: "all 0.2s ease",
        }}
      >
        {isInitializing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: colors.textSecondary,
              gap: 12,
            }}
          >
            <style>
              {`
                @keyframes lola-spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <div
              style={{
                width: 32,
                height: 32,
                border: `3px solid ${colors.border}`,
                borderTopColor: colors.userBubble,
                borderRadius: "50%",
                animation: "lola-spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: 14 }}>Connecting...</span>
          </div>
        ) : (
          <>
            {error && (
              <div
                style={{
                  padding: "10px 12px",
                  marginBottom: 12,
                  background: isDark ? "#3a1f1f" : "#fee",
                  color: colors.error,
                  borderRadius: 8,
                  fontSize: 12,
                  border: `1px solid ${colors.error}40`,
                }}
              >
                {error}
              </div>
            )}
            {isDraggingOverChat && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? "rgba(42, 58, 74, 0.9)" : "rgba(232, 242, 255, 0.9)",
                  zIndex: 100,
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    padding: "20px 32px",
                    background: colors.surfaceElevated,
                    borderRadius: 16,
                    border: `2px dashed #0066ff`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#0066ff" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>Solte aqui para enviar</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>Imagens e áudio</div>
                </div>
              </div>
            )}
            <MessageList items={messages} typing={loading} theme={theme} colors={colors} />
            <div ref={messagesEndRef} style={{ height: 1 }} />
          </>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && !isCollapsed && (
        <button
          onClick={() => {
            scrollToBottom("smooth");
            setShowScrollButton(false);
            isUserScrollingRef.current = false;
          }}
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.userBubble,
            color: "#ffffff",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 10,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New messages
        </button>
      )}

      {/* Composer */}
      <div style={{ borderTop: `1px solid ${colors.border}`, background: colors.surfaceElevated, display: isCollapsed ? "none" : "block" }}>
        <Composer onSend={onSend} disabled={!session || loading} theme={theme} colors={colors} />
      </div>
    </div>
  );
}


