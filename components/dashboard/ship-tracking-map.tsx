"use client";

import { useEffect, useState } from "react";
import { Ship, Clock, Gauge, MapPin, X, Navigation } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { PulseDot } from "@/components/pulse-dot";
import { ships as initialShips } from "@/lib/data";

export function ShipTrackingMap() {
  const [ships, setShips] = useState(initialShips);
  const [selectedShip, setSelectedShip] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShips((prev) =>
        prev.map((ship) => ({
          ...ship,
          speed:
            (parseFloat(ship.speed) + (Math.random() - 0.5) * 0.4).toFixed(1) +
            " knots",
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selected = ships.find((s) => s.id === selectedShip);

  return (
    <GlassCard neon className="col-span-full lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-neon" />
          <h2 className="text-base font-semibold text-foreground">
            Live Ship Tracking
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PulseDot color="success" />
          <span>Real-time AIS Feed</span>
        </div>
      </div>

      {/* Simulated Map */}
      <div className="relative mb-6 h-52 overflow-hidden rounded-lg border border-border bg-navy-deep">
        <div className="absolute inset-0 grid-bg opacity-50" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 300"
          aria-hidden="true"
        >
          {/* Simplified world landmasses */}
          <path
            d="M120,80 L180,60 L220,70 L240,90 L220,130 L180,150 L140,140 L110,120 Z"
            fill="rgba(0,212,255,0.06)"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />
          <path
            d="M300,50 L380,40 L420,60 L450,50 L500,60 L520,90 L500,120 L460,130 L420,140 L380,150 L340,140 L300,120 L280,100 Z"
            fill="rgba(0,212,255,0.06)"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />
          <path
            d="M480,130 L520,120 L560,130 L580,160 L570,200 L540,220 L500,210 L490,180 L470,160 Z"
            fill="rgba(0,212,255,0.06)"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />
          <path
            d="M600,100 L680,80 L740,100 L750,140 L720,160 L680,170 L640,160 L620,140 Z"
            fill="rgba(0,212,255,0.06)"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />
          <path
            d="M650,180 L700,170 L740,180 L750,220 L720,250 L680,260 L650,240 L640,210 Z"
            fill="rgba(0,212,255,0.06)"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />

          {/* Ship routes */}
          <line
            x1="340"
            y1="80"
            x2="680"
            y2="150"
            stroke="rgba(0,212,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="640"
            y1="110"
            x2="200"
            y2="130"
            stroke="rgba(0,212,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="380"
            y1="70"
            x2="560"
            y2="160"
            stroke="rgba(0,212,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Ship 1 - Atlantic Crown */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setSelectedShip(selectedShip === "VSL-2847" ? null : "VSL-2847")
            }
          >
            <circle cx="460" cy="100" r="6" fill="#00d4ff" opacity="0.3">
              <animate
                attributeName="r"
                values="6;10;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="460"
              cy="100"
              r="4"
              fill={selectedShip === "VSL-2847" ? "#00d4ff" : "#00d4ff"}
              stroke={selectedShip === "VSL-2847" ? "#fff" : "none"}
              strokeWidth="1"
            />
            <text
              x="470"
              y="95"
              fill="#00d4ff"
              fontSize="8"
              fontFamily="monospace"
            >
              MV Atlantic Crown
            </text>
          </g>

          {/* Ship 2 - Pacific Voyager (Delayed - red) */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setSelectedShip(selectedShip === "VSL-1093" ? null : "VSL-1093")
            }
          >
            <circle cx="280" cy="120" r="6" fill="#ef4444" opacity="0.3">
              <animate
                attributeName="r"
                values="6;10;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="280"
              cy="120"
              r="4"
              fill="#ef4444"
              stroke={selectedShip === "VSL-1093" ? "#fff" : "none"}
              strokeWidth="1"
            />
            <text
              x="290"
              y="115"
              fill="#ef4444"
              fontSize="8"
              fontFamily="monospace"
            >
              SS Pacific Voyager
            </text>
          </g>

          {/* Ship 3 - Nordic Star */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setSelectedShip(selectedShip === "VSL-5521" ? null : "VSL-5521")
            }
          >
            <circle cx="540" cy="145" r="6" fill="#00d4ff" opacity="0.3">
              <animate
                attributeName="r"
                values="6;10;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="540"
              cy="145"
              r="4"
              fill="#00d4ff"
              stroke={selectedShip === "VSL-5521" ? "#fff" : "none"}
              strokeWidth="1"
            />
            <text
              x="550"
              y="140"
              fill="#00d4ff"
              fontSize="8"
              fontFamily="monospace"
            >
              MV Nordic Star
            </text>
          </g>
        </svg>

        {/* Popup for selected ship */}
        {selected && (
          <div className="absolute right-3 top-3 w-56 rounded-lg border border-neon/30 bg-navy-medium/95 p-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-neon">{selected.name}</span>
              <button
                onClick={() => setSelectedShip(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-foreground">{selected.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Origin</span>
                <span className="text-foreground">{selected.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="text-foreground">{selected.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed</span>
                <span className="text-foreground">{selected.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cargo</span>
                <span className="text-foreground">{selected.cargo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium ${
                    selected.status === "On-Time"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ship list */}
      <div className="flex flex-col gap-3">
        {ships.map((ship) => (
          <button
            key={ship.id}
            onClick={() =>
              setSelectedShip(selectedShip === ship.id ? null : ship.id)
            }
            className={`flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-all sm:flex-row sm:items-center sm:justify-between ${
              selectedShip === ship.id
                ? "border-neon/40 bg-neon/5"
                : "border-border bg-secondary/50 hover:border-neon/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neon/10">
                <Ship className="h-4 w-4 text-neon" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {ship.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {ship.id} | {ship.cargo}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                ETA: {ship.eta.split(" ")[1]}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Gauge className="h-3 w-3" />
                {ship.speed}
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  ship.status === "On-Time"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {ship.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
