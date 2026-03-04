import { ShipTrackingMap } from "@/components/dashboard/ship-tracking-map";
import { ShipmentTracker } from "@/components/dashboard/shipment-tracker";
import { CongestionChart } from "@/components/dashboard/congestion-chart";
import { ContainerTable } from "@/components/dashboard/container-table";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {/* Ship tracking takes 2 cols on large screens */}
      <ShipTrackingMap />

      {/* Shipment tracker */}
      <ShipmentTracker />

      {/* Congestion chart */}
      <CongestionChart />

      {/* PORT-AI Assistant */}
      <AIChatWidget />

      {/* Alerts panel */}
      <AlertsPanel />

      {/* Container table full width */}
      <ContainerTable />
    </div>
  );
}
