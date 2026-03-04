"use client";

import { useState } from "react";
import { Search, Package, MapPin, Anchor, Clock, AlertTriangle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { shipmentLookup } from "@/lib/data";

type ShipmentResult = (typeof shipmentLookup)[string] | null;

export function ShipmentTracker() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ShipmentResult>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      const found = shipmentLookup[query.toUpperCase()] || null;
      setResult(found);
      setLoading(false);
    }, 800);
  };

  const riskColors = {
    Low: "bg-success/10 text-success",
    Medium: "bg-warning/10 text-warning",
    High: "bg-destructive/10 text-destructive",
  };

  return (
    <GlassCard neon>
      <div className="mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-neon" />
        <h2 className="text-base font-semibold text-foreground">Shipment Tracking</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="Enter Shipment ID (e.g. SHP-20931)"
            className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30"
          />
        </div>
        <Button
          onClick={handleTrack}
          className="bg-neon text-primary-foreground hover:bg-neon/90 shrink-0"
          disabled={!query.trim()}
        >
          Track
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neon border-t-transparent" />
        </div>
      )}

      {!loading && searched && !result && (
        <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No shipment found. Try SHP-20931, SHP-40127, or SHP-71583.</p>
        </div>
      )}

      {!loading && result && (
        <div className="space-y-3 rounded-lg border border-neon/20 bg-neon/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipment</span>
            <span className="font-mono text-sm font-bold text-neon">{result.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="text-sm text-foreground">{result.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Anchor className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Dock</div>
                <div className="text-sm text-foreground">{result.dock}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">ETA</div>
                <div className="text-sm text-foreground">{result.eta}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Risk Level</div>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[result.risk]}`}>
                  {result.risk}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
            <Timer className="h-4 w-4 text-warning" />
            <span className="text-sm text-foreground">
              Delay Prediction: <span className="font-bold text-warning">{result.delay > 0 ? `+${result.delay} hours` : "No delay expected"}</span>
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
