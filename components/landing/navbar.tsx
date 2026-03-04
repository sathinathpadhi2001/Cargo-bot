"use client";

import Link from "next/link";
import { useState } from "react";
import { Anchor, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon/10 neon-border">
            <Anchor className="h-5 w-5 text-neon" />
          </div>
          <span className="text-lg font-bold text-foreground">
            AI Smart<span className="text-neon">Port</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-neon">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-neon">
            Dashboard
          </Link>
          <Link href="/architecture" className="text-sm text-muted-foreground transition-colors hover:text-neon">
            Architecture
          </Link>
          <Link href="/analytics" className="text-sm text-muted-foreground transition-colors hover:text-neon">
            Analytics
          </Link>
          <Link href="/voice" className="text-sm text-muted-foreground transition-colors hover:text-neon">
            Voice AI
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard">
            <Button variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 hover:text-neon">
              View Live Dashboard
            </Button>
          </Link>
          <Link href="/voice">
            <Button className="bg-neon text-primary-foreground hover:bg-neon/90 neon-glow">
              Request Demo
            </Button>
          </Link>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-neon" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-neon" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link href="/architecture" className="text-sm text-muted-foreground hover:text-neon" onClick={() => setMobileOpen(false)}>
              Architecture
            </Link>
            <Link href="/analytics" className="text-sm text-muted-foreground hover:text-neon" onClick={() => setMobileOpen(false)}>
              Analytics
            </Link>
            <Link href="/voice" className="text-sm text-muted-foreground hover:text-neon" onClick={() => setMobileOpen(false)}>
              Voice AI
            </Link>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full border-neon/30 text-neon hover:bg-neon/10">
                View Live Dashboard
              </Button>
            </Link>
            <Link href="/voice" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-neon text-primary-foreground hover:bg-neon/90">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
