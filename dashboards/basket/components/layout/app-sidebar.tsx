"use client";

import { BarChart3, Boxes, CircleHelp, House, Megaphone, Settings2, ShoppingCart, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BasketLogo } from "@/components/basket-logo";

const navigation = [
  { label: "Dashboard", icon: House }, { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Boxes }, { label: "Customers", icon: UsersRound },
  { label: "Analysis", icon: BarChart3 }, { label: "Marketing", icon: Megaphone },
] as const;
export type Section = typeof navigation[number]["label"] | "Settings";

export function AppSidebar({ brand, active, onNavigate, open, onClose }: {
  brand: string;
  active: Section;
  onNavigate: (section: Section) => void;
  open: boolean;
  onClose: () => void;
}) {
  return <>
    {open && <button type="button" onClick={onClose} className="fixed inset-0 z-30 cursor-pointer bg-black/70 backdrop-blur-sm lg:hidden" aria-label="Close navigation" />}
    <aside data-open={open} className="fixed top-4 bottom-4 left-4 z-40 flex h-[calc(100dvh---spacing(8))] min-h-0 w-56 flex-col overflow-y-auto rounded-3xl bg-sidebar p-3.5 transition-[translate,visibility] duration-180 ease-in-out max-lg:data-[open=false]:invisible max-lg:data-[open=false]:-translate-x-[calc(100%+--spacing(8))] motion-reduce:transition-none lg:sticky lg:bottom-auto lg:left-auto lg:w-full lg:max-xl:top-3.5 lg:max-xl:h-[calc(100dvh---spacing(7))]" aria-label="Main navigation">
      <Link href="/" className="mb-6 flex h-9 items-center gap-2.5 px-1.5 text-base font-semibold tracking-tight">
        <BasketLogo className="size-7 -translate-y-0.5 shrink-0 text-primary" />
        {brand}
      </Link>
      <Button variant="ghost" size="icon-lg" className="absolute top-3 right-2 text-sidebar-foreground lg:hidden" onClick={onClose} aria-label="Close menu"><X className="size-6" /></Button>
      <nav className="flex flex-col gap-2">
        {navigation.map(({ label, icon: Icon }) => (
          <Button key={label} variant="ghost" onClick={() => { onNavigate(label); onClose(); }} aria-current={active === label ? "page" : undefined} className={cn("h-11 justify-start gap-3 rounded-xl px-3 font-normal text-sidebar-foreground hover:bg-sidebar-accent", active === label && "bg-sidebar-accent font-medium text-primary hover:text-primary")}>
            <Icon className="size-5" strokeWidth={1.7} />{label}
          </Button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2 pt-12">
        <Button variant="ghost" onClick={() => { onNavigate("Settings"); onClose(); }} aria-current={active === "Settings" ? "page" : undefined} className={cn("h-11 justify-start gap-3 rounded-xl px-3 font-normal text-sidebar-foreground hover:bg-sidebar-accent", active === "Settings" && "bg-sidebar-accent font-medium text-primary hover:text-primary")}>
          <Settings2 className="size-5" />Settings
        </Button>
        <Link href="/help" onClick={onClose} className="flex h-11 items-center gap-3 rounded-xl px-3 font-normal text-sidebar-foreground outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-ring/50">
          <CircleHelp className="size-5" />Help Center
        </Link>
      </div>
    </aside>
  </>;
}
