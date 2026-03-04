"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/components/pulse-dot";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-neon/3 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-4 py-2">
          <PulseDot color="neon" />
          <span className="text-sm font-medium text-neon">Live System Monitoring Active</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
          AI-Powered Smart Port{" "}
          <span className="text-neon text-glow">Shipment Intelligence</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
          Real-time ship tracking, container intelligence, and predictive delay
          analytics. Transform your port operations with enterprise AI.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-neon text-primary-foreground hover:bg-neon/90 neon-glow gap-2 px-8 text-base font-semibold"
            >
              <Radio className="h-4 w-4" />
              View Live Dashboard
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-neon/30 text-neon hover:bg-neon/10 hover:text-neon gap-2 px-8 text-base"
            >
              Request Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { label: "Ships Tracked", value: "12,400+" },
            { label: "Containers/Day", value: "50,000+" },
            { label: "Prediction Accuracy", value: "97.8%" },
            { label: "Ports Connected", value: "340+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-neon md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
