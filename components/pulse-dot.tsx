"use client";

import { cn } from "@/lib/utils";

interface PulseDotProps {
  color?: "neon" | "success" | "warning" | "destructive";
  className?: string;
}

const colorMap = {
  neon: "bg-neon",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const glowMap = {
  neon: "bg-neon/40",
  success: "bg-success/40",
  warning: "bg-warning/40",
  destructive: "bg-destructive/40",
};

export function PulseDot({ color = "neon", className }: PulseDotProps) {
  return (
    <span className={cn("relative flex h-2.5 w-2.5", className)}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          glowMap[color]
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          colorMap[color]
        )}
      />
    </span>
  );
}
