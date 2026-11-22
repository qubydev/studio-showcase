import "server-only";
import { cacheLife } from "next/cache";
import sample from "@/data/dashboard.json";
import type { DashboardData } from "./types";
import { createDemoAnalytics } from "./demo-analytics";
import { addDays, localDate } from "@/lib/date-range";

// Replace this adapter with a database query or API request. Components only
// depend on DashboardData and never import the sample file directly.
export async function getDashboardData(): Promise<DashboardData> {
  "use cache";
  cacheLife("hours");
  const today = localDate();
  return { ...sample, date: today, analytics: createDemoAnalytics("2024-01-01", addDays(today, 1), sample.countries, sample.products) } as DashboardData;
}
