"use client";

import { BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { congestionData } from "@/lib/data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function CongestionChart() {
  return (
    <GlassCard neon>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-neon" />
          <h2 className="text-base font-semibold text-foreground">Port Congestion Analytics</h2>
        </div>
        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
          Peak: 91%
        </span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={congestionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="congestionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.08)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(0,212,255,0.1)" }}
              tickLine={false}
              domain={[40, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d152c",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}%`, "Yard Occupancy"]}
            />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#congestionGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
