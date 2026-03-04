"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { processPortAIQuery, type PortAIResponse } from "@/lib/port-ai-engine";

interface Message {
  role: "user" | "bot";
  text?: string;
  response?: PortAIResponse;
}

const quickActions = [
  "Track SHP-20931",
  "Dock 7 status",
  "Delayed shipments",
  "Reefer alerts",
];

function MiniStructured({ report }: { report: NonNullable<PortAIResponse["structured"]> }) {
  const riskColor = {
    LOW: "text-emerald-400",
    MEDIUM: "text-amber-400",
    HIGH: "text-orange-400",
    CRITICAL: "text-red-400",
  }[report.riskLevel];

  const fields = [
    report.shipmentId && { label: "Shipment", value: report.shipmentId },
    report.vessel && { label: "Vessel", value: report.vessel },
    report.currentLocation && { label: "Location", value: report.currentLocation },
    report.dock && { label: "Dock", value: report.dock },
    report.eta && { label: "ETA", value: report.eta },
    report.delayPrediction && { label: "Delay", value: report.delayPrediction },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mt-1 rounded-lg border border-[rgba(0,212,255,0.15)] bg-[rgba(7,13,30,0.8)] overflow-hidden text-xs">
      {fields.slice(0, 4).map((f, i) => (
        <div key={i} className="flex items-center gap-2 border-b border-[rgba(0,212,255,0.06)] px-2.5 py-1.5 last:border-0">
          <span className="text-[10px] text-[#64748b] uppercase tracking-wider shrink-0 w-14">{f.label}</span>
          <span className="text-[#e2e8f0] font-mono text-[11px] truncate">{f.value}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 border-t border-[rgba(0,212,255,0.08)] bg-[rgba(0,212,255,0.03)] px-2.5 py-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${riskColor}`}>
          Risk: {report.riskLevel}
        </span>
        <span className="text-[10px] text-[#64748b] truncate ml-1">· {report.operationalNote.slice(0, 60)}…</span>
      </div>
    </div>
  );
}

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      response: {
        thinking: [],
        toolCalls: [],
        structured: null,
        freeText: "PORT-AI online. I can track shipments, check dock status, and analyze risks. What do you need?",
        riskLevel: null,
      },
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    // Small artificial delay for realism
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
    const response = await processPortAIQuery(msg);

    setMessages((prev) => [...prev, { role: "bot", response }]);
    setLoading(false);
  };

  return (
    <GlassCard neon className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-neon" />
          <h2 className="text-sm font-semibold text-foreground">PORT-AI Assistant</h2>
        </div>
        <Link
          href="/port-ai"
          className="flex items-center gap-1 rounded-lg border border-[rgba(0,212,255,0.2)] px-2 py-1 text-[10px] font-medium text-[#00d4ff] transition-colors hover:bg-[rgba(0,212,255,0.08)]"
        >
          Full Chat <ExternalLink className="h-2.5 w-2.5" />
        </Link>
      </div>

      {/* Messages */}
      <div className="mb-3 flex max-h-60 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-secondary" : "bg-neon/20"
                }`}
            >
              {msg.role === "user" ? (
                <User className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Bot className="h-3 w-3 text-neon" />
              )}
            </div>
            <div className="max-w-[85%]">
              {msg.role === "user" ? (
                <div className="rounded-lg bg-neon/10 px-2.5 py-1.5 text-xs text-foreground">
                  {msg.text}
                </div>
              ) : (
                <div className="rounded-lg bg-secondary/80 px-2.5 py-1.5 text-xs text-foreground">
                  {msg.response?.structured ? (
                    <MiniStructured report={msg.response.structured} />
                  ) : (
                    <span>{msg.response?.freeText?.slice(0, 180)}{(msg.response?.freeText?.length ?? 0) > 180 ? "…" : ""}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/20">
              <Bot className="h-3 w-3 text-neon" />
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary/80 px-2.5 py-1.5">
              <div className="h-1 w-1 animate-bounce rounded-full bg-neon" style={{ animationDelay: "0ms" }} />
              <div className="h-1 w-1 animate-bounce rounded-full bg-neon" style={{ animationDelay: "150ms" }} />
              <div className="h-1 w-1 animate-bounce rounded-full bg-neon" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="mb-2 flex flex-wrap gap-1">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleSend(action)}
            disabled={loading}
            className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-neon/30 hover:text-neon disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask PORT-AI..."
          className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30"
          disabled={loading}
        />
        <Button
          onClick={() => handleSend()}
          size="sm"
          className="bg-neon text-primary-foreground hover:bg-neon/90 shrink-0"
          disabled={!input.trim() || loading}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </GlassCard>
  );
}
