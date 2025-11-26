"use client";
import { useEffect } from "react";

type MessageListProps = {
  items: any[];
  typing?: boolean;
  theme?: "light" | "dark";
  colors?: any;
};

export default function MessageList({ items, typing, theme = "light", colors }: MessageListProps) {
  const defaultColors = theme === "dark"
    ? {
        text: "#ffffff",
        textSecondary: "#a0a0a0",
        userBubble: "#0066ff",
        botBubble: "#2d2d2d",
      }
    : {
        text: "#1a1a1a",
        textSecondary: "#6b7280",
        userBubble: "#0066ff",
        botBubble: "#f1f3f5",
      };

  const finalColors = colors || defaultColors;

  // Split bot messages with multiple lines into separate bubbles (like WhatsApp)
  const splitMessages = (items: any[]) => {
    const result: any[] = [];
    let globalIndex = 0;

    items.forEach((m, index) => {
      // Only split bot messages with text that has double line breaks (paragraph breaks)
      if (m.role === "bot" && m.type === "text" && m.text && m.text.includes('\n\n')) {
        // Split by double line breaks (paragraph breaks) - like WhatsApp
        const paragraphs = m.text.split(/\n\n+/).filter((p: string) => p.trim());
        
        if (paragraphs.length > 1) {
          // Multiple paragraphs - split into separate bubbles (like WhatsApp)
          paragraphs.forEach((paragraph: string, paraIndex: number) => {
            result.push({
              ...m,
              _id: m._id ? `${m._id}-part-${paraIndex}` : undefined,
              _optimisticId: m._optimisticId ? `${m._optimisticId}-part-${paraIndex}` : undefined,
              text: paragraph.trim(),
              _splitIndex: globalIndex++,
              _originalIndex: index,
            });
          });
        } else {
          // Only one paragraph after splitting - keep as single bubble
          result.push({ ...m, _splitIndex: globalIndex++, _originalIndex: index });
        }
      } else {
        // Keep as is (user messages, images, audio, or bot messages without double breaks)
        result.push({ ...m, _splitIndex: globalIndex++, _originalIndex: index });
      }
    });

    return result;
  };

  const splitItems = splitMessages(items);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {splitItems.map((m, i) => (
        <div 
          key={m._id || m._optimisticId || `split-${i}`} 
          data-message-index={m._splitIndex ?? i}
          data-original-index={m._originalIndex}
        >
          <Bubble
            role={m.role}
            type={m.type}
            text={m.text}
            url={m.url}
            mime={m.mime}
            theme={theme}
            colors={finalColors}
          />
        </div>
      ))}
      {typing && <TypingIndicator colors={finalColors} />}
    </div>
  );
}

function Bubble({
  role,
  type,
  text,
  url,
  mime,
  theme,
  colors,
}: {
  role: string;
  type: string;
  text?: string;
  url?: string;
  mime?: string;
  theme?: "light" | "dark";
  colors?: any;
}) {
  const isUser = role === "user";
  const isDark = theme === "dark";

  const formatText = (text: string) => {
    if (!text) return null;
    
    // Split by lines to handle paragraphs, lists, and headers
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if it's a header (starts with #)
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length; // 1-6
        const content = headerMatch[2];
        const fontSize = level === 1 ? 20 : level === 2 ? 18 : level === 3 ? 16 : 14;
        const marginTop = index > 0 ? (level === 1 ? 16 : level === 2 ? 14 : 12) : 0;
        const marginBottom = level <= 3 ? 8 : 4;
        
        elements.push(
          <div 
            key={`header-${index}`} 
            style={{ 
              marginTop,
              marginBottom,
              fontWeight: 700,
              fontSize,
              color: isUser ? "#ffffff" : colors.text,
            }}
          >
            {formatInlineMarkdown(content, isUser)}
          </div>
        );
      }
      // Check if it's a bullet point (starts with -, *, or •)
      else if (/^[-*•]\s/.test(trimmedLine)) {
        const content = trimmedLine.substring(trimmedLine.indexOf(' ') + 1);
        elements.push(
          <div key={`line-${index}`} style={{ display: 'flex', alignItems: 'flex-start', marginTop: index > 0 ? 6 : 0, marginBottom: 4 }}>
            <span style={{ marginRight: 8, color: isUser ? "#ffffff" : colors.text }}>•</span>
            <span style={{ flex: 1 }}>{formatInlineMarkdown(content, isUser)}</span>
          </div>
        );
      } else if (trimmedLine) {
        // Regular paragraph
        elements.push(
          <div key={`line-${index}`} style={{ marginTop: index > 0 ? 8 : 0 }}>
            {formatInlineMarkdown(trimmedLine, isUser)}
          </div>
        );
      } else {
        // Empty line for spacing
        elements.push(<div key={`line-${index}`} style={{ height: 4 }} />);
      }
    });
    
    return elements;
  };

  const formatInlineMarkdown = (text: string, isUser: boolean): JSX.Element[] => {
    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    const textColor = isUser ? "#ffffff" : colors.text;
    
    // Match **bold** or __bold__
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
    let match;
    let lastIndex = 0;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} style={{ color: textColor }}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add bold text
      const boldText = match[1] || match[2];
      parts.push(
        <strong key={`bold-${match.index}`} style={{ color: textColor, fontWeight: 600 }}>
          {boldText}
        </strong>
      );
      
      lastIndex = boldRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} style={{ color: textColor }}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : [<span key="text" style={{ color: textColor }}>{text}</span>];
  };

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8 }}>
      <div
        style={{
          maxWidth: "85%",
          background: isUser ? colors.userBubble : colors.botBubble,
          color: isUser ? "#ffffff" : colors.text,
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          boxShadow: isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 1px 3px rgba(0, 0, 0, 0.1)",
          wordWrap: "break-word",
          fontSize: 14,
          lineHeight: 1.6,
          textAlign: "left",
        }}
      >
        {type === "text" && text && (
          <div style={{ textAlign: "left", width: "100%" }}>
            {formatText(text)}
          </div>
        )}
        {type === "image" && url && (
          <img
            src={url}
            alt="upload"
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              display: "block",
              marginTop: text ? 8 : 0,
            }}
          />
        )}
        {type === "audio" && url && (
          <audio
            src={url}
            controls
            style={{
              width: "100%",
              marginTop: text ? 8 : 0,
              height: 32,
            }}
          />
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ colors }: { colors?: any }) {
  useEffect(() => {
    // Inject keyframes if not already present
    if (!document.getElementById('typing-animation')) {
      const style = document.createElement('style');
      style.id = 'typing-animation';
      style.textContent = `
        @keyframes typing-bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "10px 14px",
          background: colors?.botBubble || "#f1f3f5",
          borderRadius: "18px 18px 18px 4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: colors?.textSecondary || "#6b7280",
            animation: "typing-bounce 1.4s infinite ease-in-out",
            animationDelay: "0s",
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: colors?.textSecondary || "#6b7280",
            animation: "typing-bounce 1.4s infinite ease-in-out",
            animationDelay: "0.2s",
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: colors?.textSecondary || "#6b7280",
            animation: "typing-bounce 1.4s infinite ease-in-out",
            animationDelay: "0.4s",
          }}
        />
      </div>
    </div>
  );
}


