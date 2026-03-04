"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Thermometer,
  Container,
  Navigation,
  Clock,
  Check,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { alerts as initialAlerts } from "@/lib/data";

const iconMap = {
  idle: Clock,
  temperature: Thermometer,
  dock: Container,
  route: Navigation,
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const handleAcknowledge = (id: number) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleRestore = () => {
    setDismissedIds([]);
  };

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  return (
    <GlassCard neon>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-base font-semibold text-foreground">
            Smart Alerts
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {dismissedIds.length > 0 && (
            <button
              onClick={handleRestore}
              className="text-xs text-muted-foreground transition-colors hover:text-neon"
            >
              Restore all
            </button>
          )}
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            {activeAlerts.length} Active
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {activeAlerts.length === 0 && (
          <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-center">
            <Check className="mx-auto mb-2 h-6 w-6 text-success" />
            <p className="text-sm text-success">All alerts acknowledged</p>
          </div>
        )}
        {activeAlerts.map((alert) => {
          const Icon = iconMap[alert.type];
          return (
            <div
              key={alert.id}
              className={`group rounded-lg border p-3 transition-colors ${
                alert.severity === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-warning/30 bg-warning/5"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      alert.severity === "critical"
                        ? "text-destructive"
                        : "text-warning"
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {alert.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {alert.time}
                  </span>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="rounded p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground group-hover:opacity-100"
                    title="Acknowledge"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="pl-6 text-xs leading-relaxed text-muted-foreground">
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
