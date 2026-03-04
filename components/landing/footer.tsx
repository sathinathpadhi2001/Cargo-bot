import { Anchor } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-deep/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon/10">
              <Anchor className="h-4 w-4 text-neon" />
            </div>
            <span className="font-bold text-foreground">
              AI Smart<span className="text-neon">Port</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-neon transition-colors">
              Dashboard
            </Link>
            <Link href="/architecture" className="text-sm text-muted-foreground hover:text-neon transition-colors">
              Architecture
            </Link>
            <Link href="/analytics" className="text-sm text-muted-foreground hover:text-neon transition-colors">
              Analytics
            </Link>
            <Link href="/voice" className="text-sm text-muted-foreground hover:text-neon transition-colors">
              Voice AI
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            2026 AI SmartPort. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
