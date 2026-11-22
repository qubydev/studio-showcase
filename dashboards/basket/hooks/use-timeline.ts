"use client";

import { useState, useSyncExternalStore } from "react";
import { localDate, type DateRange } from "@/lib/date-range";

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  return () => window.removeEventListener("focus", onChange);
}

export function useTimeline(serverDate: string) {
  const today = useSyncExternalStore(subscribe, localDate, () => serverDate);
  const [selection, setSelection] = useState<DateRange | null>(null);
  return [selection ?? { from: today }, setSelection] as const;
}
