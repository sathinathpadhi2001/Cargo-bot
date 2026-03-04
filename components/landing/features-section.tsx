"use client";

import Link from "next/link";
import {
  Navigation,
  BrainCircuit,
  Container,
  Mic,
  BellRing,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";

const features = [
  {
    icon: Navigation,
    title: "Live Ship Tracking",
    description:
      "Monitor vessel positions, speeds, and routes in real time using AIS data with sub-minute refresh rates.",
    href: "/dashboard",
  },
  {
    icon: BrainCircuit,
    title: "AI Delay Prediction",
    description:
      "Machine learning models predict delays up to 72 hours ahead with 97.8% accuracy, factoring weather and port congestion.",
    href: "/analytics",
  },
  {
    icon: Container,
    title: "Smart Container Monitoring",
    description:
      "IoT-enabled tracking for temperature, humidity, and location of every container across your port yards.",
    href: "/dashboard",
  },
  {
    icon: Mic,
    title: "Voice-Based Shipment Status",
    description:
      "Call our AI voice bot for instant shipment updates. Natural language processing delivers data hands-free.",
    href: "/voice",
  },
  {
    icon: BellRing,
    title: "Intelligent Alerts System",
    description:
      "Automated alerts for temperature breaches, idle containers, dock overloads, and route deviations.",
    href: "/dashboard",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.02] to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Enterprise-Grade Port Intelligence
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            A unified platform that combines real-time data, AI predictions, and
            intelligent automation to transform port operations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <GlassCard
              key={feature.title}
              neon
              className="group cursor-default transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 transition-colors group-hover:bg-neon/20">
                <feature.icon className="h-6 w-6 text-neon" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
