import { DashboardSidebarProvider } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebarProvider>
      <DashboardTopbar />
      <main className="flex-1 p-6">{children}</main>
    </DashboardSidebarProvider>
  );
}
