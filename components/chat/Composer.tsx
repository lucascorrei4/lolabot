"use client";
import { useRef, useState, useEffect, useCallback } from "react";

type ComposerProps = {
  onSend: (p: { type: "text" | "image" | "audio"; text?: string; url?: string; mime?: string; file?: File | null }) => void;
  disabled?: boolean;
  theme?: "light" | "dark";
  colors?: any;
};

export default function Composer({ onSend, disabled, theme = "light", colors }: ComposerProps) {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  const defaultColors = isDark
    ? {
        bg: "#2d2d2d",
        border: "#333333",
        text: "#ffffff",
        textSecondary: "#a0a0a0",
        hover: "#353535",
      }
    : {
        bg: "#ffffff",
        border: "#e5e7eb",
        text: "#1a1a1a",
        textSecondary: "#6b7280",
        hover: "#f8f9fa",
      };

  const finalColors = colors || defaultColors;

  const sendText = () => {
    if (!text.trim()) return;
    onSend({ type: "text", text });
    setText("");
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    handleFile(f);
    e.target.value = "";
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("audio/")) {
      return; // Only accept images and audio
    }
    const type = file.type.startsWith("audio/") ? "audio" : "image";
    onSend({ type, file, mime: file.type });
  }, [onSend]);

  const processClipboardImage = useCallback((e: ClipboardEvent | React.ClipboardEvent) => {
    if (disabled) return false;
    
    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return false;

    // Check if there's an image in clipboard
    let imageItem: DataTransferItem | null = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        imageItem = item;
        break;
      }
    }

    // If image found, process it
    if (imageItem) {
      try {
        const file = imageItem.getAsFile();
        if (file && file.size > 0) {
          handleFile(file);
          return true; // Image was processed
        } else {
          console.warn("Failed to get file from clipboard item");
        }
      } catch (error) {
        console.error("Error processing pasted image:", error);
      }
    }
    
    return false; // No image found or failed to process
  }, [disabled, handleFile]);

  // Handle paste event on input directly
  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const imageProcessed = processClipboardImage(e);
    if (imageProcessed) {
      e.preventDefault();
      e.stopPropagation();
      // Don't let text be pasted if image was processed
    }
    // If no image, let default paste behavior happen (text)
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(f => f.type.startsWith("image/") || f.type.startsWith("audio/"));
    
    if (validFile) {
      handleFile(validFile);
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        display: "flex",
        gap: 8,
        padding: 12,
        alignItems: "flex-end",
        background: isDragging ? (isDark ? "#2a3a4a" : "#e8f2ff") : finalColors.bg,
        border: isDragging ? `2px dashed #0066ff` : `2px solid transparent`,
        borderRadius: 12,
        transition: "all 0.2s ease",
      }}
    >
      {/* Attachment Button */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={disabled}
        style={{
          border: `1px solid ${finalColors.border}`,
          background: finalColors.bg,
          borderRadius: 12,
          padding: 10,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: finalColors.textSecondary,
          opacity: disabled ? 0.5 : 1,
          transition: "all 0.2s ease",
          minWidth: 40,
          height: 40,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = finalColors.hover;
            e.currentTarget.style.color = finalColors.text;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = finalColors.bg;
          e.currentTarget.style.color = finalColors.textSecondary;
        }}
        title="Attach image/audio"
      >
        <AttachmentIcon />
      </button>
      <input ref={fileRef} type="file" accept="image/*,audio/*" style={{ display: "none" }} onChange={onPickFile} />

      {/* Text Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={handleInputPaste}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
          }
        }}
        placeholder="Type a message..."
        disabled={disabled}
        style={{
          flex: 1,
          border: `1px solid ${finalColors.border}`,
          borderRadius: 12,
          padding: "10px 14px",
          background: finalColors.bg,
          color: finalColors.text,
          fontSize: 14,
          outline: "none",
          transition: "all 0.2s ease",
          minHeight: 40,
          resize: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0066ff";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = finalColors.border;
        }}
      />

      {/* Send Button */}
      <button
        onClick={sendText}
        disabled={!canSend}
        style={{
          border: "none",
          background: canSend ? "#0066ff" : finalColors.border,
          borderRadius: 12,
          padding: 10,
          cursor: canSend ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: canSend ? "#ffffff" : finalColors.textSecondary,
          transition: "all 0.2s ease",
          minWidth: 40,
          height: 40,
        }}
        onMouseEnter={(e) => {
          if (canSend) {
            e.currentTarget.style.background = "#0052cc";
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = canSend ? "#0066ff" : finalColors.border;
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

function AttachmentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


