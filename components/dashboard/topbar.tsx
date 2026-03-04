"use client";

import { useState } from "react";
import { Bell, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/components/pulse-dot";
import { alerts } from "@/lib/data";

export function DashboardTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          Port Operations Center
        </h1>
        <div className="hidden items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 md:flex">
          <PulseDot color="success" />
          <span className="text-xs font-medium text-success">All Systems Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shipments..."
            className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Notification bell with dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-popover p-4 shadow-lg backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg p-2.5 text-xs ${
                        alert.severity === "critical"
                          ? "border border-destructive/20 bg-destructive/5"
                          : "border border-warning/20 bg-warning/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{alert.title}</span>
                        <span className="text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="mt-1 text-muted-foreground">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/20 text-neon">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
