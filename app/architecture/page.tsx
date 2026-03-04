"use client";

import Link from "next/link";
import {
  Ship,
  Radio,
  Cloud,
  BrainCircuit,
  LayoutDashboard,
  Mic,
  BellRing,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

const layers = [
  {
    icon: Ship,
    title: "Ships (AIS Data)",
    description: "Real-time Automatic Identification System data from 12,400+ vessels worldwide. Position updates every 2 seconds.",
    color: "text-neon",
    bgColor: "bg-neon/10",
  },
  {
    icon: Radio,
    title: "IoT / RFID Sensors",
    description: "50,000+ IoT sensors across port yards tracking temperature, humidity, location, and container integrity in real time.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure (AWS)",
    description: "Elastic compute on AWS with auto-scaling. Handles 2M+ events/second with 99.99% uptime. Multi-region for global redundancy.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: BrainCircuit,
    title: "AI Prediction Engine",
    description: "Deep learning models trained on 5 years of shipping data. Predicts delays, congestion, and optimal routing with 97.8% accuracy.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
];

const outputs = [
  {
    icon: LayoutDashboard,
    title: "Live Dashboard",
    description: "Real-time operational command center for port managers.",
    href: "/dashboard",
  },
  {
    icon: Mic,
    title: "Voice Bot",
    description: "Natural language voice interface for hands-free updates.",
    href: "/voice",
  },
  {
    icon: BellRing,
    title: "Alert System",
    description: "Intelligent notifications for anomalies and critical events.",
    href: "/analytics",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="relative pt-24 pb-16 grid-bg">
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-neon transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-5xl text-balance">
              System <span className="text-neon text-glow">Architecture</span>
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground text-pretty">
              A multi-layered architecture designed for scale, reliability, and
              real-time intelligence across global port operations.
            </p>
          </div>

          {/* Data flow layers */}
          <div className="flex flex-col items-center gap-2">
            {layers.map((layer, i) => (
              <div key={layer.title} className="flex w-full flex-col items-center">
                <GlassCard neon className="w-full max-w-lg transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${layer.bgColor}`}>
                      <layer.icon className={`h-6 w-6 ${layer.color}`} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">
                        {layer.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
                {i < layers.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div className="h-6 w-px bg-neon/30" />
                    <ArrowDown className="h-5 w-5 text-neon/50" />
                    <div className="h-6 w-px bg-neon/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Arrow to outputs */}
          <div className="flex flex-col items-center py-4">
            <div className="h-8 w-px bg-neon/30" />
            <ArrowDown className="h-6 w-6 text-neon" />
            <div className="h-4 w-px bg-neon/30" />
          </div>

          {/* Output layer */}
          <div className="grid gap-6 md:grid-cols-3">
            {outputs.map((output) => (
              <Link key={output.title} href={output.href}>
                <GlassCard
                  neon
                  className="text-center transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10">
                    <output.icon className="h-6 w-6 text-neon" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">{output.title}</h3>
                  <p className="text-sm text-muted-foreground">{output.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
