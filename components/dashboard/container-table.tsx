"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Thermometer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  MapPin,
  Package,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { containers as initialContainers } from "@/lib/data";

export function ContainerTable() {
  const [containers, setContainers] = useState(initialContainers);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "alert" | "active" | "idle">(
    "all"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setContainers((prev) =>
        prev.map((c) => ({
          ...c,
          temperature: parseFloat(
            (c.temperature + (Math.random() - 0.5) * 0.3).toFixed(1)
          ),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "all"
      ? containers
      : filter === "alert"
        ? containers.filter((c) => c.riskAlert)
        : containers.filter(
            (c) => c.status.toLowerCase() === filter
          );

  return (
    <GlassCard neon className="col-span-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Container className="h-5 w-5 text-neon" />
          <h2 className="text-base font-semibold text-foreground">
            Container Monitoring
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "alert", "active", "idle"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-neon/20 text-neon border border-neon/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f}
              {f === "alert" &&
                ` (${containers.filter((c) => c.riskAlert).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Container ID
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contents
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Temperature
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Location
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Risk
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Expand</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((container) => {
              const overThreshold =
                container.temperature > container.threshold;
              const isExpanded = expandedId === container.id;
              return (
                <>
                  <tr
                    key={container.id}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : container.id)
                    }
                    className={`cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                      isExpanded ? "bg-secondary/20" : ""
                    }`}
                  >
                    <td className="py-3 font-mono text-sm text-neon">
                      {container.id}
                    </td>
                    <td className="py-3 text-foreground">
                      {container.contents}
                    </td>
                    <td className="py-3">
                      <span
                        className={`flex items-center gap-1 font-mono ${
                          overThreshold
                            ? "font-bold text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        <Thermometer
                          className={`h-3 w-3 ${
                            overThreshold
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                        {container.temperature}°C
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {container.location}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          container.status === "Active"
                            ? "bg-success/10 text-success"
                            : container.status === "Alert"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                        }`}
                      >
                        {container.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {container.riskAlert ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          Alert
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${container.id}-detail`}>
                      <td colSpan={7} className="border-b border-border/50 px-4 py-3">
                        <div className="grid gap-4 rounded-lg bg-secondary/30 p-4 sm:grid-cols-3">
                          <div className="flex items-start gap-2">
                            <Thermometer className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Threshold
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {container.threshold}°C
                              </div>
                              {overThreshold && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                                  <AlertTriangle className="h-3 w-3" />
                                  Exceeds by{" "}
                                  {(
                                    container.temperature -
                                    container.threshold
                                  ).toFixed(1)}
                                  °C
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Full Location
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {container.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Contents
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {container.contents}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Last scanned: 4 min ago
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
