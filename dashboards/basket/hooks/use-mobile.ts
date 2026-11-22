"use client";

import { useSyncExternalStore } from "react";

const phoneQuery = "(width < 40rem)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(phoneQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(phoneQuery).matches, () => false);
}
