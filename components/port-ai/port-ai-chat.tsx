"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Bot,
    User,
    Send,
    Sparkles,
    ChevronRight,
    Wrench,
    Brain,
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
    Zap,
    Anchor,
    RotateCcw,
    Copy,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { processPortAIQuery, type PortAIResponse, type StructuredReport } from "@/lib/port-ai-engine";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Message {
    id: string;
    role: "user" | "bot";
    text?: string;
    response?: PortAIResponse;
    timestamp: string;
}

// ─── Quick Prompts ───────────────────────────────────────────────────────────

const quickPrompts = [
    { label: "Track SHP-20931", icon: "📦" },
    { label: "Dock 7 status", icon: "⚓" },
    { label: "Status CNTR-44573", icon: "🌡️" },
    { label: "Show all ships", icon: "🚢" },
    { label: "Delayed shipments", icon: "⏱️" },
    { label: "Port congestion", icon: "📊" },
    { label: "Weather at Rotterdam", icon: "🌀" },
    { label: "Show active alerts", icon: "🚨" },
];

// ─── Risk Badge ──────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) {
    const config = {
        LOW: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", label: "LOW RISK" },
        MEDIUM: { icon: AlertTriangle, color: "text-amber-400 bg-amber-400/10 border-amber-400/30", label: "MEDIUM RISK" },
        HIGH: { icon: AlertTriangle, color: "text-orange-400 bg-orange-400/10 border-orange-400/30", label: "HIGH RISK" },
        CRITICAL: { icon: XCircle, color: "text-red-400 bg-red-400/10 border-red-400/30", label: "CRITICAL" },
    };
    const { icon: Icon, color, label } = config[level];
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider ${color}`}>
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
}

// ─── Structured Report Card ──────────────────────────────────────────────────

function StructuredReportCard({ report }: { report: StructuredReport }) {
    const fields = [
        report.shipmentId && { label: "Shipment ID", value: report.shipmentId, mono: true },
        report.vessel && { label: "Vessel", value: report.vessel, mono: false },
        report.currentLocation && { label: "Current Location", value: report.currentLocation, mono: false },
        report.dock && { label: "Dock", value: report.dock, mono: false },
        report.eta && { label: "ETA", value: report.eta, mono: true },
        report.delayPrediction && { label: "Delay Prediction", value: report.delayPrediction, mono: false },
        ...(report.extraFields ?? []).map((f) => ({ label: f.label, value: f.value, mono: false })),
    ].filter(Boolean) as { label: string; value: string; mono: boolean }[];

    return (
        <div className="mt-2 rounded-xl border border-[rgba(0,212,255,0.15)] bg-[rgba(13,21,44,0.8)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgba(0,212,255,0.12)] px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00d4ff]">
                    PORT-AI Intelligence Report
                </span>
                <RiskBadge level={report.riskLevel} />
            </div>

            {/* Fields grid */}
            {fields.length > 0 && (
                <div className="grid grid-cols-1 gap-0 divide-y divide-[rgba(0,212,255,0.06)] sm:grid-cols-2 sm:divide-y-0">
                    {fields.map((f, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-0.5 px-4 py-3 border-b border-[rgba(0,212,255,0.06)] last:border-0"
                        >
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#64748b]">
                                {f.label}
                            </span>
                            <span className={`text-sm text-[#e2e8f0] ${f.mono ? "font-mono" : ""}`}>
                                {f.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Operational Note */}
            <div className="border-t border-[rgba(0,212,255,0.12)] bg-[rgba(0,212,255,0.03)] px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-[#00d4ff]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d4ff]">
                        Operational Note
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-[#cbd5e1]">{report.operationalNote}</p>
            </div>
        </div>
    );
}

// ─── Tool Call Display ───────────────────────────────────────────────────────

function ToolCallsDisplay({ toolCalls }: { toolCalls: PortAIResponse["toolCalls"] }) {
    const [expanded, setExpanded] = useState(false);
    if (toolCalls.length === 0) return null;

    return (
        <div className="mt-2">
            <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1.5 text-[10px] font-medium text-[#64748b] transition-colors hover:text-[#00d4ff]"
            >
                <Wrench className="h-3 w-3" />
                {toolCalls.length} tool{toolCalls.length > 1 ? "s" : ""} called
                <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>

            {expanded && (
                <div className="mt-2 flex flex-col gap-1.5">
                    {toolCalls.map((tc, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-[rgba(0,212,255,0.1)] bg-[rgba(0,212,255,0.03)] px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-[#00d4ff] shrink-0" />
                                <code className="text-xs font-bold text-[#00d4ff]">{tc.name}</code>
                                <span className="text-[10px] text-[#64748b]">
                                    ({Object.entries(tc.args).map(([k, v]) => `${k}="${v}"`).join(", ")})
                                </span>
                                <span className="ml-auto text-[10px] text-emerald-400">✓ OK</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Thinking Trace ──────────────────────────────────────────────────────────

function ThinkingTrace({ steps }: { steps: string[] }) {
    const [expanded, setExpanded] = useState(false);
    if (steps.length === 0) return null;

    return (
        <div className="mt-1.5">
            <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1.5 text-[10px] font-medium text-[#64748b] transition-colors hover:text-[#00d4ff]"
            >
                <Brain className="h-3 w-3" />
                Reasoning chain ({steps.length} steps)
                <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>

            {expanded && (
                <div className="mt-2 rounded-lg border border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.3)] px-3 py-2">
                    <ol className="flex flex-col gap-1">
                        {steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[rgba(0,212,255,0.1)] text-center text-[10px] font-bold text-[#00d4ff] leading-4">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

// ─── Free Text Renderer ───────────────────────────────────────────────────────

function FreeTextRenderer({ text }: { text: string }) {
    // Simple markdown-like renderer for bold and bullet points
    const lines = text.split("\n");
    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />;

                // Replace **bold** markers
                const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={j} className="text-[#e2e8f0] font-semibold">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                });

                // Bullet points
                if (line.startsWith("• ")) {
                    return (
                        <div key={i} className="flex items-start gap-2 text-sm text-[#cbd5e1] leading-relaxed">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00d4ff]" />
                            <span>{parts}</span>
                        </div>
                    );
                }

                return (
                    <p key={i} className="text-sm text-[#cbd5e1] leading-relaxed">
                        {parts}
                    </p>
                );
            })}
        </div>
    );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === "user";

    const handleCopy = () => {
        const text = message.text || (message.response?.freeText ?? "");
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isUser) {
        return (
            <div className="flex items-start justify-end gap-3">
                <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/10 border border-[#00d4ff]/20 px-4 py-3">
                        <p className="text-sm text-[#e2e8f0]">{message.text}</p>
                    </div>
                    <p className="mt-1 text-right text-[10px] text-[#64748b]">{message.timestamp}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)]">
                    <User className="h-4 w-4 text-[#00d4ff]" />
                </div>
            </div>
        );
    }

    const { response } = message;
    if (!response) return null;

    return (
        <div className="flex items-start gap-3">
            {/* Bot avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/30 to-[#0ea5e9]/20 border border-[#00d4ff]/30">
                <Bot className="h-4 w-4 text-[#00d4ff]" />
            </div>

            <div className="min-w-0 flex-1 max-w-[85%]">
                {/* Bubble */}
                <div className="rounded-2xl rounded-tl-sm border border-[rgba(0,212,255,0.12)] bg-[rgba(13,21,44,0.6)] px-4 py-3 backdrop-blur-sm">
                    {/* Structured report */}
                    {response.structured && (
                        <StructuredReportCard report={response.structured} />
                    )}

                    {/* Free text */}
                    {response.freeText && (
                        <FreeTextRenderer text={response.freeText} />
                    )}

                    {/* Tool calls */}
                    <ToolCallsDisplay toolCalls={response.toolCalls} />

                    {/* Thinking trace */}
                    <ThinkingTrace steps={response.thinking} />
                </div>

                {/* Footer with timestamp and copy */}
                <div className="mt-1 flex items-center gap-2">
                    <p className="text-[10px] text-[#64748b]">{message.timestamp}</p>
                    <button
                        onClick={handleCopy}
                        className="text-[10px] text-[#64748b] transition-colors hover:text-[#00d4ff] flex items-center gap-1"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator({ steps }: { steps: string[] }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % Math.max(steps.length, 1));
        }, 600);
        return () => clearInterval(interval);
    }, [steps]);

    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/30 to-[#0ea5e9]/20 border border-[#00d4ff]/30">
                <Bot className="h-4 w-4 text-[#00d4ff] animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-[rgba(0,212,255,0.12)] bg-[rgba(13,21,44,0.6)] px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00d4ff]" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00d4ff]" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00d4ff]" style={{ animationDelay: "300ms" }} />
                    </div>
                    {steps.length > 0 && (
                        <p className="text-xs text-[#64748b] font-mono">
                            {steps[currentStep]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Chat Component ──────────────────────────────────────────────────────

export function PortAIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "init",
            role: "bot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            response: {
                thinking: [],
                toolCalls: [],
                structured: null,
                freeText: "**PORT-AI online.** I am your intelligent logistics operations agent for this industrial shipping port.\n\nI have access to 7 real-time tools:\n• getShipmentStatus · getShipLocation · getDockOccupancy\n• getContainerStatus · predictDelay · getWeatherImpact · triggerAlert\n\nProvide a shipment ID, container ID, dock number, or vessel name — and I will give you a precise, structured intelligence report.",
                riskLevel: null,
            },
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = useCallback(
        async (text?: string) => {
            const msg = (text || input).trim();
            if (!msg || isLoading) return;

            setInput("");
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            const userMessage: Message = {
                id: `user-${Date.now()}`,
                role: "user",
                text: msg,
                timestamp,
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);
            setThinkingSteps(["Parsing query...", "Identifying data entities...", "Calling tools...", "Composing intelligence report..."]);

            // Simulate realistic processing time
            await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

            const response = await processPortAIQuery(msg);
            setIsLoading(false);
            setThinkingSteps([]);

            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                role: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                response,
            };

            setMessages((prev) => [...prev, botMessage]);
            inputRef.current?.focus();
        },
        [input, isLoading]
    );

    const handleReset = () => {
        setMessages([
            {
                id: "init-reset",
                role: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                response: {
                    thinking: [],
                    toolCalls: [],
                    structured: null,
                    freeText: "Session reset. PORT-AI systems re-initialized. How can I assist you?",
                    riskLevel: null,
                },
            },
        ]);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#060b18]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgba(0,212,255,0.12)] bg-[rgba(7,13,30,0.95)] px-6 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff]/30 to-[#0ea5e9]/20 border border-[#00d4ff]/30">
                        <Anchor className="h-5 w-5 text-[#00d4ff]" />
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d4ff] opacity-50" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00d4ff]" />
                        </span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-[#e2e8f0]">
                            PORT<span className="text-[#00d4ff]">-AI</span>
                        </h1>
                        <p className="text-[11px] text-[#64748b]">
                            Intelligent Logistics Operations Agent · Live
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">7 tools active</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="rounded-lg border border-[rgba(0,212,255,0.15)] p-2 text-[#64748b] transition-colors hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]"
                        title="Reset conversation"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator steps={thinkingSteps} />}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Quick prompts */}
            <div className="border-t border-[rgba(0,212,255,0.08)] bg-[rgba(7,13,30,0.8)] px-4 py-3 backdrop-blur-xl">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {quickPrompts.map((p) => (
                            <button
                                key={p.label}
                                onClick={() => handleSend(p.label)}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 rounded-full border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.04)] px-3 py-1 text-xs text-[#94a3b8] transition-all hover:border-[rgba(0,212,255,0.35)] hover:bg-[rgba(0,212,255,0.08)] hover:text-[#00d4ff] disabled:opacity-40"
                            >
                                <span>{p.icon}</span>
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Sparkles className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask PORT-AI — e.g. Track SHP-20931 or Dock 7 status..."
                                className="w-full rounded-xl border border-[rgba(0,212,255,0.15)] bg-[rgba(13,21,44,0.8)] py-3 pr-4 pl-10 text-sm text-[#e2e8f0] placeholder:text-[#64748b] focus:border-[rgba(0,212,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.1)] transition-all"
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="shrink-0 rounded-xl bg-[#00d4ff] px-4 text-[#060b18] font-semibold hover:bg-[#00d4ff]/90 disabled:opacity-40 transition-all"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    <p className="mt-2 text-center text-[10px] text-[#475569]">
                        PORT-AI v2.0 · Simulated environment · 7 tools · Predictive reasoning enabled
                    </p>
                </div>
            </div>
        </div>
    );
}
