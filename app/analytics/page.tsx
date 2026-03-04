"use client";

import Link from "next/link";
import {
  Ship,
  Container,
  Clock,
  TrendingUp,
  DollarSign,
  Timer,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { analyticsMetrics, dailyThroughput, delayDistribution } from "@/lib/data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const metricCards = [
  {
    label: "Total Ships Today",
    value: analyticsMetrics.totalShips,
    icon: Ship,
    trend: "+12%",
    trendUp: true,
    suffix: "",
  },
  {
    label: "Total Containers",
    value: analyticsMetrics.totalContainers.toLocaleString(),
    icon: Container,
    trend: "+8%",
    trendUp: true,
    suffix: "",
  },
  {
    label: "Delayed Shipments",
    value: analyticsMetrics.delayedShipments,
    icon: Clock,
    trend: "-23%",
    trendUp: false,
    suffix: "",
  },
  {
    label: "On-Time Rate",
    value: analyticsMetrics.onTimeRate,
    icon: TrendingUp,
    trend: "+2.1%",
    trendUp: true,
    suffix: "%",
  },
  {
    label: "Cost Savings",
    value: analyticsMetrics.costSavings,
    icon: DollarSign,
    trend: "+$340K",
    trendUp: true,
    suffix: "M",
    prefix: "$",
  },
  {
    label: "Avg Turnaround",
    value: analyticsMetrics.avgTurnaround,
    icon: Timer,
    trend: "-1.2 hrs",
    trendUp: false,
    suffix: " hrs",
  },
];

const PIE_COLORS = ["#00d4ff", "#06b6d4", "#0ea5e9", "#38bdf8", "#22d3ee"];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="relative pt-24 pb-16 grid-bg">
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-neon transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-5xl text-balance">
              Admin <span className="text-neon text-glow">Analytics</span>
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground text-pretty">
              Comprehensive overview of port performance, operational efficiency,
              and predictive insights.
            </p>
          </div>

          {/* Metric cards */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metricCards.map((metric) => (
              <GlassCard key={metric.label} neon className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10">
                  <metric.icon className="h-5 w-5 text-neon" />
                </div>
                <div className="mb-1 text-2xl font-bold text-foreground">
                  {metric.prefix || ""}{metric.value}{metric.suffix}
                </div>
                <div className="mb-2 text-xs text-muted-foreground">{metric.label}</div>
                <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${metric.trendUp ? (metric.label === "Delayed Shipments" ? "text-success" : "text-success") : (metric.label === "Avg Turnaround" ? "text-success" : "text-destructive")}`}>
                  {(metric.label === "Delayed Shipments" || metric.label === "Avg Turnaround") ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {metric.trend} vs last week
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Throughput */}
            <GlassCard neon>
              <h3 className="mb-4 text-base font-semibold text-foreground">Daily Throughput</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyThroughput} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.08)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d152c",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="containers" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.8} name="Containers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Delay Distribution */}
            <GlassCard neon>
              <h3 className="mb-4 text-base font-semibold text-foreground">Delay Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={delayDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="range"
                      stroke="none"
                    >
                      {delayDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d152c",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                        fontSize: "12px",
                      }}
                      formatter={(value: number, name: string) => [`${value} shipments`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {delayDistribution.map((item, i) => (
                  <div key={item.range} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{item.range}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Ships per day bar within throughput */}
          <div className="mt-6">
            <GlassCard neon>
              <h3 className="mb-4 text-base font-semibold text-foreground">Vessels Per Day</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyThroughput} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.08)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d152c",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="ships" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.8} name="Vessels" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
