"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconMessage,
  IconLeaf,
  IconPackage,
  IconRefresh,
  IconCheck,
  IconArrowRight,
} from "@/components/Icons";

interface ChatMessage {
  id: string;
  from: "user" | "bot";
  text: string;
  time: string;
  intent?: string;
  escalated?: boolean;
}

const QUICK_PROMPTS = [
  { label: "Track Order #RAY-2024-891", text: "Hi, can you tell me where my order #RAY-2024-891 is right now?" },
  { label: "Report Damaged Toothbrush", text: "I received my order #RAY-2024-891 today but the bamboo kit is cracked. Can I get a replacement?" },
  { label: "Order #SUS-2024-8842", text: "Has order #SUS-2024-8842 been delivered yet?" },
  { label: "Packaging Materials Inquiry", text: "What materials do you use to package and ship orders?" },
  { label: "Refund Escalation", text: "I need an urgent manager refund for an order that never arrived." },
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"simulator" | "architecture">("simulator");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      from: "bot",
      text: "Hello, I'm Ava, your Sustainify Sustainable Commerce Concierge. I can help track your shipment, arrange eco-returns, or answer questions about our circular materials. How can I help today?",
      time: "Just now",
      intent: "general",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Support agent temporarily unavailable.");
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: json.data?.response || "I have received your inquiry. How else can I assist?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intent: json.data?.intent,
        escalated: json.data?.escalate_to_human,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "bot",
          text: `${err instanceof Error ? err.message : "Support service communication error."}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          intent: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        from: "bot",
        text: "Session refreshed! How can I help you today?",
        time: "Just now",
        intent: "general",
      },
    ]);
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Module 04 • Customer Support Intelligence
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 font-medium">WhatsApp Cloud API & Webhook Simulator</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <IconMessage className="w-5 h-5" />
          </span>
          <span>WhatsApp AI <span className="gradient-text">Support Concierge</span></span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl font-normal">
          Automated customer support bot with database order lookup, damaged item return policies, intent classification, and tier-2 human escalation.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-white text-emerald-900 border border-slate-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live Interactive Simulator
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-emerald-900 border border-slate-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Webhook Architecture & Integrations
          </button>
        </div>
      </div>

      {activeTab === "simulator" ? (
        <div className="space-y-6 animate-fade-up">
          {/* Quick Test Prompt Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Click-to-Test Realistic Scenarios:
              </span>
              <button
                onClick={clearChat}
                className="text-[11px] text-slate-400 hover:text-slate-700 font-medium"
              >
                Clear History
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-all cursor-pointer text-left font-medium shadow-2xs"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Web Style Container */}
          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
            {/* WhatsApp App Header */}
            <div className="bg-[#064e3b] px-5 py-3.5 border-b border-[#053d2e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-white">
                    <IconLeaf className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#064e3b]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">Ava • Sustainify Concierge</span>
                    <span className="text-emerald-300 text-xs" title="Verified Assistant">
                      <IconCheck className="w-3.5 h-3.5 inline" />
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 font-mono">
                    Online • Verified Sustainable Commerce Bot
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-100 border border-emerald-600/40 font-semibold">
                  WA-CLOUD-API
                </span>
              </div>
            </div>

            {/* Chat Body */}
            <div
              className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[460px] min-h-[380px] bg-[#f8faf9]"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                      msg.from === "user"
                        ? "bg-[#065f46] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {/* Bot header info */}
                    {msg.from === "bot" && (
                      <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-100 text-[10px]">
                        <span className="font-semibold text-emerald-800 flex items-center gap-1">
                          <IconLeaf className="w-3 h-3 text-emerald-600" />
                          Sustainify Assistant
                        </span>
                        {msg.intent && (
                          <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            Intent: {msg.intent}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Escalation alert */}
                    {msg.escalated && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg font-medium">
                        <span className="font-bold text-amber-700">!</span>
                        <span>
                          Escalated to human support agent. Ticket #SUS-{Date.now().toString().slice(-4)} created.
                        </span>
                      </div>
                    )}

                    {/* Timestamp & read receipts */}
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 font-medium ${
                        msg.from === "user" ? "text-emerald-100/80" : "text-slate-400"
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.from === "user" && <span className="text-emerald-200 font-bold">✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse delay-100" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse delay-200" />
                    <span className="ml-1 text-[11px] font-mono text-emerald-800 font-semibold">Ava is querying database...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a WhatsApp message (e.g. 'Where is my order #RAY-2024-891?')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 font-medium"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !inputMessage.trim()}
                className="btn-primary py-2.5 px-4 rounded-xl cursor-pointer"
              >
                <span>Send</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Architecture & Integrations Tab */
        <div className="space-y-8 animate-fade-up">
          {/* Capabilities */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: IconPackage,
                title: "Live Order Status Lookup",
                desc: "Parses order numbers (e.g. #RAY-2024-891), queries the database Orders table, and injects real-time shipment status into prompt context.",
              },
              {
                icon: IconRefresh,
                title: "Sustainable Return Policies",
                desc: "Enforces 30-day eco-return window and 7-day damaged item immediate replacement guarantee without customer friction.",
              },
              {
                icon: IconCheck,
                title: "Refund & Escalation Logic",
                desc: "Detects emotional dissatisfaction or damaged arrivals and flags escalate_to_human=true for automated tier-2 dispatch.",
              },
              {
                icon: IconLeaf,
                title: "Circular Commerce FAQs",
                desc: "Answers complex customer inquiries regarding FSC certifications, compostable mailers, and carbon-neutral logistics.",
              },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">{c.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Webhook Flow */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold mb-5">
              Production Webhook Message Flow
            </h2>
            <div className="space-y-3">
              {[
                { step: "01", actor: "Customer", action: "Sends message from WhatsApp mobile client" },
                { step: "02", actor: "Meta Cloud API", action: "Validates webhook and triggers POST /api/chat/message" },
                { step: "03", actor: "Chat Service", action: "Pulls recent ChatLog history + looks up order in database Orders table" },
                { step: "04", actor: "Gemini 2.5 Flash", action: "Evaluates policy context and returns intent classification + response" },
                { step: "05", actor: "Postgres Audit", action: "Persists conversation in ChatLog and AIOutput tables" },
                { step: "06", actor: "Meta API", action: "Delivers verified WhatsApp reply back to customer in < 1 second" },
              ].map((f) => (
                <div key={f.step} className="flex items-center gap-4 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-900 font-mono text-xs font-bold shrink-0">
                    {f.step}
                  </span>
                  <span className="text-xs font-mono text-emerald-800 font-semibold w-32 shrink-0">
                    {f.actor}
                  </span>
                  <span className="text-xs text-slate-700 font-medium">
                    {f.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
