"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/i18n";
import BottomNav from "@/components/BottomNav";

// ── Icons ──────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BotAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#c9b59c] flex items-center justify-center flex-shrink-0"
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ChatbotPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  function formatTime(d: Date) {
    return d.toLocaleTimeString(lang === "th" ? "th-TH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  function getBotResponse(input: string): { text: string; chips?: string[] } {
    const q = input.toLowerCase();
    for (const qa of t.botQA) {
      if (qa.keywords.some((k: string) => q.includes(k))) {
        return { text: qa.answer, chips: qa.chips };
      }
    }
    return {
      text: t.botFallback,
      chips: t.botChipsFallback,
    };
  }

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      sender: "bot",
      text: t.botWelcome,
      time: formatTime(new Date()),
      chips: t.botChipsWelcome,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define Message type here since I removed the top-level one
  type Message = {
    id: string;
    sender: "user" | "bot";
    text: string;
    time: string;
    chips?: string[];
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      time: formatTime(new Date()),
    };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const { text: botText, chips } = getBotResponse(text);
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botText,
          time: formatTime(new Date()),
          chips,
        },
      ]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }

  return (
    <div className="flex flex-col bg-[#f5f3f0] h-dvh overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-14 pb-4 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-[#f5f1ed] flex items-center justify-center text-[#4a4a4a] flex-shrink-0"
          >
            <BackIcon />
          </button>

          <BotAvatar size={38} />

          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#3a3a3a] leading-tight truncate">{t.botTitle}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-[11px] text-green-500 font-medium">{t.botOnline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-3"
        style={{ paddingBottom: "160px" }}
      >
        {messages.map((msg, idx) => {
          const isBot = msg.sender === "bot";
          // show avatar only on first bot msg in a run
          const prevIsBot = idx > 0 && messages[idx - 1].sender === "bot";

          return (
            <div key={msg.id} className="flex flex-col">
              {/* Row */}
              <div className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
                {/* Bot avatar (only first in sequence) */}
                {isBot && !prevIsBot ? (
                  <BotAvatar size={28} />
                ) : isBot ? (
                  <div className="w-7 flex-shrink-0" />
                ) : null}

                {/* Bubble */}
                <div className="max-w-[78%] flex flex-col">
                  <div
                    className={`px-4 py-2.5 text-[13px] leading-relaxed ${isBot
                        ? "bg-white text-[#3a3a3a] rounded-2xl rounded-tl-md shadow-sm"
                        : "bg-[#c4b5a0] text-white rounded-2xl rounded-tr-md shadow-sm"
                      }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp */}
                  <p className={`text-[10px] text-[#b0a898] mt-1 ${isBot ? "ml-1" : "text-right mr-1"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>

              {/* Quick-reply chips (only latest bot msg) */}
              {isBot && msg.chips && idx === messages.length - 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 mt-2 ml-9">
                  {msg.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="px-3 py-1.5 bg-white border border-[#e2dbd3] rounded-full text-[11px] text-[#6b5f55] font-medium shadow-sm active:bg-[#f5f1ed] transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <BotAvatar size={28} />
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex gap-1 items-center">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-1.5 h-1.5 bg-[#c4b5a0] rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar: same width/centering as BottomNav ── */}
      <div className="fixed bottom-[108px] left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[382px] z-40">
        <div className="bg-white rounded-full border border-[#e8e2db] shadow-lg flex items-center gap-2 px-2 py-1.5 w-full min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={t.botPlaceholder}
            className="flex-1 min-w-0 bg-transparent px-3 py-1.5 text-[13px] outline-none text-[#3a3a3a] placeholder:text-[#bbb]"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-[#c4b5a0] disabled:bg-[#e5ddd6] text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav />
    </div>
  );
}