"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppSidebar, type Section } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import type { DateRange } from "@/lib/date-range";
import type { DashboardData } from "@/lib/dashboard/types";

export function DashboardShell({ data, query, onQueryChange, active, onNavigate, selectedRange, onRangeChange, children }: { data: DashboardData; query: string; onQueryChange: (value: string) => void; active: Section; onNavigate: (section: Section) => void; selectedRange: DateRange; onRangeChange: (range: DateRange) => void; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  return <div className="mx-auto grid min-h-dvh w-full max-w-450 grid-cols-[minmax(0,1fr)] items-start gap-6 p-4 max-sm:p-3 lg:grid-cols-[--spacing(45)_minmax(0,1fr)] lg:max-xl:gap-5 lg:max-xl:p-3.5 xl:grid-cols-[--spacing(52)_minmax(0,1fr)]">
    <a href="#main-content" className="fixed top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-24 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground focus:translate-y-0">Skip to content</a>
    <AppSidebar brand={data.brand} active={active} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className="flex min-w-0 flex-col self-stretch">
      <div className="sticky top-0 z-20 -mt-3 flex shrink-0 flex-col bg-background pt-3 sm:-mt-4 sm:pt-4 lg:max-xl:-mt-3.5 lg:max-xl:pt-3.5">
        <AppTopbar selectedRange={selectedRange} onRangeChange={onRangeChange} data={data} query={query} onQueryChange={onQueryChange} onMenu={() => setMenuOpen(true)} />
      </div>
      <main id="main-content" tabIndex={-1} className="flex-1 pt-4 outline-none">
        {children}
      </main>
    </div>
  </div>;
}
