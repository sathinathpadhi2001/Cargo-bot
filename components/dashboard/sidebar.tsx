"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  LayoutDashboard,
  BrainCircuit,
  Mic,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  BotMessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "PORT-AI", href: "/port-ai", icon: BotMessageSquare },
  { label: "Architecture", href: "/architecture", icon: BrainCircuit },
  { label: "Voice AI", href: "/voice", icon: Mic },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

// Context for sidebar state
const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });

export function useSidebarState() {
  return useContext(SidebarContext);
}

export function DashboardSidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebarInner collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={cn(
            "flex flex-1 flex-col transition-all duration-300",
            collapsed ? "pl-16" : "pl-60"
          )}
        >
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function DashboardSidebarInner({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon/10">
            <Anchor className="h-4 w-4 text-neon" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-sidebar-foreground">
              AI Smart<span className="text-neon">Port</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-neon"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-neon")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
