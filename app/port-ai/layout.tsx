import { DashboardSidebarProvider } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default function PortAILayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardSidebarProvider>
            <DashboardTopbar />
            <main className="flex-1 overflow-hidden">{children}</main>
        </DashboardSidebarProvider>
    );
}
