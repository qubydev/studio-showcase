"use client";

import { Bell, CheckCheck, ChevronLeft, CreditCard, LogOut, Menu, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "@/components/graphics/profile-avatar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "@/lib/date-range";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardData } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppTopbar({ data, query, onQueryChange, onMenu, selectedRange, onRangeChange }: {
  data: DashboardData;
  query: string;
  onQueryChange: (value: string) => void;
  onMenu: () => void;
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}) {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const unreadCount = data.notifications.filter(item => !readIds.has(item.id)).length;
  const [mobileSearch, setMobileSearch] = useState(false);
  const isMobile = useIsMobile();
  const searchInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  function closeMobileSearch() {
    setMobileSearch(false);
    searchInput.current?.blur();
    menuButton.current?.focus({ preventScroll: true });
  }

  return (
    <>
    <header ref={header} className="mb-2 flex h-11 shrink-0 items-center gap-3">
      <Button ref={menuButton} variant="secondary" size="icon-lg" className="rounded-full lg:hidden" onClick={onMenu} aria-label="Open navigation"><Menu /></Button>
      <div className={cn("relative mr-auto min-w-0 flex-1", mobileSearch ? "sm:max-w-122" : "max-w-122")}>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-foreground/80" />
        <Input ref={searchInput} type="search" value={query} onChange={e => onQueryChange(e.target.value)} onFocus={() => { if (isMobile) setMobileSearch(true); }} onKeyDown={event => { if (event.key === "Escape" && mobileSearch) { event.preventDefault(); closeMobileSearch(); } }} aria-label="Search" placeholder="Search" className="rounded-full bg-card px-10 [&::-webkit-search-cancel-button]:appearance-none" />
        {query && <Button variant="ghost" size="icon-xs" className="absolute top-2 right-3 rounded-full" onClick={() => { onQueryChange(""); searchInput.current?.focus(); }} aria-label="Clear search"><X /></Button>}
      </div>
      <div className={cn("shrink-0 items-center gap-3", mobileSearch ? "hidden sm:flex" : "flex")}>
      <DateRangePicker value={selectedRange} onChange={onRangeChange} mobileAnchor={header} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary" size="icon-lg" aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"} className="relative rounded-full" />}>
          <Bell />
          {unreadCount > 0 && <span className="absolute top-2.5 right-3 size-1.5 rounded-full bg-primary ring-2 ring-card" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent anchor={isMobile ? header : undefined} align="end" className="w-85">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data.notifications.map(item => (
              <DropdownMenuItem key={item.id} className="relative items-start pr-7 text-sm" onClick={() => setReadIds(previous => new Set(previous).add(item.id))}>
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 leading-relaxed text-foreground/75">{item.detail}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
                </div>
                {!readIds.has(item.id) && <span className="absolute top-3 right-3 size-1.5 rounded-full bg-primary" role="img" aria-label="Unread notification" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {data.notifications.length === 0 && <p className="px-3 py-6 text-center text-xs text-muted-foreground">No notifications yet.</p>}
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between gap-2 p-1">
            <Button variant="ghost" size="sm" disabled={unreadCount === 0} onClick={() => setReadIds(new Set(data.notifications.map(item => item.id)))}>
              <CheckCheck />Mark all as read
            </Button>
            <Button variant="secondary" size="sm">
              View all
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" aria-label="Open profile" className="overflow-hidden rounded-full" />}>
          <ProfileAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <p className="truncate">{data.user.name}</p>
              <p className="truncate font-normal text-muted-foreground">{data.user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><UserRound />Account</DropdownMenuItem>
            <DropdownMenuItem><ShieldCheck />Security</DropdownMenuItem>
            <DropdownMenuItem><CreditCard />Billing</DropdownMenuItem>
            <DropdownMenuItem><Bell />Notification preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><LogOut />Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      {mobileSearch && <Button variant="secondary" size="icon-lg" className="rounded-full sm:hidden" onClick={closeMobileSearch} aria-label="Close search"><ChevronLeft /></Button>}
    </header>
    </>
  );
}
