"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.02] to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
          Ready to See It in Action?
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-muted-foreground text-pretty">
          Explore every feature of the platform. Navigate between the live
          dashboard, system architecture, and detailed analytics.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard" className="group">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_25px_rgba(0,212,255,0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 transition-colors group-hover:bg-neon/20">
                <Radio className="h-6 w-6 text-neon" />
              </div>
              <span className="text-sm font-semibold text-foreground">Live Dashboard</span>
              <span className="text-xs text-muted-foreground">Real-time operations</span>
            </div>
          </Link>



          <Link href="/architecture" className="group">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_25px_rgba(0,212,255,0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 transition-colors group-hover:bg-neon/20">
                <ArrowRight className="h-6 w-6 text-neon" />
              </div>
              <span className="text-sm font-semibold text-foreground">Architecture</span>
              <span className="text-xs text-muted-foreground">System deep-dive</span>
            </div>
          </Link>

          <Link href="/analytics" className="group">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_25px_rgba(0,212,255,0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 transition-colors group-hover:bg-neon/20">
                <BarChart3 className="h-6 w-6 text-neon" />
              </div>
              <span className="text-sm font-semibold text-foreground">Analytics</span>
              <span className="text-xs text-muted-foreground">Performance insights</span>
            </div>
          </Link>
        </div>

        <div className="mt-10">
          <Link href="/dashboard">
            <Button size="lg" className="bg-neon text-primary-foreground hover:bg-neon/90 neon-glow gap-2 px-8 text-base font-semibold">
              Enter the Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
