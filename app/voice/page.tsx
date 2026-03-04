"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  Phone,
  Volume2,
  MessageSquare,
  ArrowLeft,
  PhoneOff,
  Bot,
  User,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { PulseDot } from "@/components/pulse-dot";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// PORT-AI conversations using the agent's structured response format
const demoConversations = [
  {
    label: "Track Shipment",
    user: "Track shipment SHP-20931",
    bot: `Shipment ID: SHP-20931
Current Location: Dock 4, Berth B
Dock: Dock 4
ETA: 2026-03-04 10:00
Delay Prediction: No delay expected
Risk Level: LOW
Operational Note: Vessel MV Atlantic Crown completed unloading at 08:45 AM. Dispatch scheduled for tomorrow at 10:00 AM. All containers cleared customs inspection.`,
  },
  {
    label: "Delayed Shipments",
    user: "Are there any delayed shipments right now?",
    bot: `I've analyzed all active shipments. There are currently 8 delayed shipments across the port.

Shipment ID: SHP-40127
Current Location: En Route - Pacific Ocean
Dock: Dock 9 (Assigned)
ETA: 2026-03-08 09:15
Delay Prediction: +14 hours
Risk Level: HIGH
Operational Note: SS Pacific Voyager deviated 12nm from planned route due to severe weather in the Pacific corridor. Recommend pre-staging Dock 9 equipment and notifying downstream logistics partners.

Shipment ID: SHP-71583
Current Location: Arabian Sea - 450nm from port
Dock: Dock 2 (Assigned)
ETA: 2026-03-06 22:00
Delay Prediction: +3 hours
Risk Level: MEDIUM
Operational Note: MV Nordic Star experiencing moderate headwinds. Minor delay, no rerouting needed.`,
  },
  {
    label: "Reefer Alerts",
    user: "What is the temperature status of reefer containers?",
    bot: `I'm detecting 2 temperature anomalies flagged as HIGH RISK.

Container ID: CNTR-44573
Temperature: 28.4\u00B0C (Threshold: 25\u00B0C)
Location: Dock 7 - Bay 3
Contents: Pharmaceuticals
Risk Level: HIGH
Action: Temperature exceeds safe threshold by 3.4\u00B0C. Immediate inspection required. Triggering alert to dock supervisor.

Container ID: CNTR-33817
Temperature: 31.7\u00B0C (Threshold: 25\u00B0C)
Location: Dock 2 - Bay 1
Contents: Chemical Reagents
Risk Level: HIGH
Action: Temperature exceeds safe threshold by 6.7\u00B0C. Container flagged for emergency cooling protocol.

All other reefer containers are operating within normal parameters.`,
  },
  {
    label: "Dock Status",
    user: "What is the occupancy of Dock 7?",
    bot: `Dock 7 Status Report:

Occupancy: 94% (NEAR CAPACITY)
Active Vessels: 3
Queued Vessels: 1
Avg Turnaround: 22.4 hours
Congestion Level: HIGH

Operational Note: Dock 7 is operating near maximum capacity. Current congestion is primarily due to delayed unloading of pharmaceutical containers requiring temperature-controlled handling. I recommend rerouting incoming vessel VSL-3392 to Dock 5 (currently at 61% occupancy) to prevent operational bottleneck. Estimated impact of current congestion: +4.2 hours average delay for queued vessels.`,
  },
];

// Chat-style queries
const chatSuggestions = [
  "Track shipment SHP-40127",
  "Get weather impact for Singapore port",
  "Show dock occupancy for Dock 2",
  "Predict delay for SHP-71583",
  "Trigger alert for container CNTR-44573",
];

const chatResponses: Record<string, string> = {
  "Track shipment SHP-40127":
    "Shipment SHP-40127 is currently en route via Pacific Ocean aboard SS Pacific Voyager. ETA: Mar 8, 09:15. Delay: +14 hours. Risk: HIGH. Severe weather causing route deviation.",
  "Get weather impact for Singapore port":
    "Singapore Port Weather Impact: Moderate rain expected over next 48 hours. Wind speeds 15-20 knots from SW. Visibility: Good. Impact Assessment: Minor delays possible for berthing operations. No typhoon warnings active.",
  "Show dock occupancy for Dock 2":
    "Dock 2 Occupancy: 72%. Active vessels: 2. Available berths: 1. MV Nordic Star (SHP-71583) assigned, arriving in ~18 hours. Current turnaround avg: 16.8 hours. Status: NORMAL.",
  "Predict delay for SHP-71583":
    "Running predictive model for SHP-71583... Analysis complete. Predicted delay: +3 hours. Confidence: 94.2%. Contributing factors: headwinds in Arabian Sea (62% weight), port congestion at destination (24%), vessel speed reduction (14%).",
  "Trigger alert for container CNTR-44573":
    "Alert triggered successfully. Type: TEMPERATURE_BREACH. Entity: CNTR-44573. Notifications sent to: Dock 7 Supervisor, Reefer Operations Team, Cargo Owner (PharmaCorp Ltd). Escalation timer set: 30 minutes. If unresolved, alert escalates to Port Operations Manager.",
};

export default function VoiceAIPage() {
  const [activeConvo, setActiveConvo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(20).fill(8));

  // Chat state
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "I am PORT-AI, your intelligent logistics operations agent. I can track shipments, monitor containers, predict delays, and manage dock operations. How can I assist you?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const simulateCall = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setDisplayedText(demoConversations[activeConvo].bot);
      setIsTyping(false);
      setShowResponse(true);
      return;
    }
    setIsPlaying(true);
    setShowResponse(false);
    setDisplayedText("");
    setIsTyping(true);

    const responseText = demoConversations[activeConvo].bot;

    setTimeout(() => {
      setShowResponse(true);
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < responseText.length) {
          setDisplayedText(responseText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsPlaying(false);
        }
      }, 12);
    }, 1500);
  }, [isPlaying, activeConvo]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveHeights(
        Array(20)
          .fill(0)
          .map(() => Math.random() * 32 + 4)
      );
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    setDisplayedText(demoConversations[activeConvo].bot);
    setShowResponse(true);
    setIsTyping(false);
    setIsPlaying(false);
  }, [activeConvo]);

  const handleChatSend = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);

    setTimeout(() => {
      const key = Object.keys(chatResponses).find((k) =>
        msg.toLowerCase().includes(k.toLowerCase().split(" ").slice(0, 3).join(" ").toLowerCase())
      );
      const response =
        key && chatResponses[key]
          ? chatResponses[key]
          : `Processing your request: "${msg}"\n\nI've analyzed the port operations data. The requested information is not currently in my active dataset. Please try one of the available queries or provide a valid shipment ID (SHP-XXXXX) or container ID (CNTR-XXXXX).`;
      setChatMessages((prev) => [...prev, { role: "bot", text: response }]);
      setChatLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="relative pt-20 grid-bg">
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-neon"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-4 py-2">
              <PulseDot color="neon" />
              <span className="text-sm font-medium text-neon">
                PORT-AI Agent Active
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-5xl text-balance">
              Voice AI{" "}
              <span className="text-neon text-glow">Shipment Assistant</span>
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground text-pretty">
              Get instant shipment updates via voice or chat. PORT-AI understands
              natural language and delivers structured, real-time port intelligence.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Phone & Voice Demo */}
            <div className="flex flex-col gap-6">
              {/* Phone Card */}
              <GlassCard neon className="text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neon/10 neon-border">
                    {isPlaying ? (
                      <Volume2 className="h-8 w-8 text-neon animate-pulse" />
                    ) : (
                      <Phone className="h-8 w-8 text-neon" />
                    )}
                  </div>
                  <h2 className="mb-1 text-xl font-bold text-foreground">
                    Call PORT-AI
                  </h2>
                  <p className="font-mono text-2xl font-bold text-neon text-glow">
                    +1-800-PORT-AI
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Available 24/7 | Avg response: 1.2s
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={simulateCall}
                    className={
                      isPlaying
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
                        : "bg-neon text-primary-foreground hover:bg-neon/90 neon-glow gap-2"
                    }
                  >
                    {isPlaying ? (
                      <>
                        <PhoneOff className="h-4 w-4" />
                        End Call
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        Simulate Call
                      </>
                    )}
                  </Button>
                </div>

                {isPlaying && (
                  <div
                    className="mt-4 flex items-center justify-center gap-0.5"
                    aria-hidden="true"
                  >
                    {waveHeights.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-neon transition-all duration-75"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Conversation tabs */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-neon" />
                  <h3 className="text-base font-semibold text-foreground">
                    Voice Conversations
                  </h3>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {demoConversations.map((convo, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveConvo(i)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        activeConvo === i
                          ? "border border-neon/30 bg-neon/20 text-neon"
                          : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {convo.label}
                    </button>
                  ))}
                </div>

                <GlassCard neon>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        You
                      </div>
                      <p className="text-sm text-foreground">
                        {demoConversations[activeConvo].user}
                      </p>
                    </div>
                  </div>

                  {showResponse && (
                    <div className="flex items-start gap-3 rounded-lg bg-neon/5 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon/20">
                        <Bot className="h-4 w-4 text-neon" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 text-xs font-medium text-neon">
                          PORT-AI
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                          {displayedText}
                          {isTyping && (
                            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-neon align-middle" />
                          )}
                        </pre>
                      </div>
                    </div>
                  )}

                  {!showResponse && isPlaying && (
                    <div className="flex items-center gap-3 rounded-lg bg-neon/5 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon/20">
                        <Bot className="h-4 w-4 text-neon" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-neon" />
                        <span className="text-sm text-muted-foreground">
                          Processing your query...
                        </span>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-neon" />
                <h3 className="text-base font-semibold text-foreground">
                  PORT-AI Chat Interface
                </h3>
              </div>

              <GlassCard
                neon
                className="flex flex-1 flex-col"
              >
                {/* Messages */}
                <div className="mb-4 flex max-h-[420px] flex-1 flex-col gap-3 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "user"
                            ? "bg-secondary"
                            : "bg-neon/20"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-neon" />
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-neon/10 text-foreground"
                            : "bg-secondary/80 text-foreground"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                          {msg.text}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-start gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon/20">
                        <Bot className="h-3.5 w-3.5 text-neon" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/80 px-3 py-2">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: "0ms" }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: "150ms" }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick suggestions */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {chatSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleChatSend(suggestion)}
                      disabled={chatLoading}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-neon/30 hover:text-neon disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !chatLoading && handleChatSend()
                    }
                    placeholder="Ask PORT-AI anything..."
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30"
                    disabled={chatLoading}
                  />
                  <Button
                    onClick={() => handleChatSend()}
                    className="bg-neon text-primary-foreground hover:bg-neon/90 shrink-0"
                    disabled={!chatInput.trim() || chatLoading}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
