"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  neon?: boolean;
}

export function GlassCard({ children, className, neon = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card backdrop-blur-xl p-6 transition-all duration-300",
        neon && "neon-border hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}
