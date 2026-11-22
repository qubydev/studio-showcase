import { addDays, parseDate } from "@/lib/date-range";
import type { CountrySales, DailyAnalytics, Product } from "./types";
import { distribute } from "./distribute";

// Deterministic, dated demo records. Replace these with persisted daily totals
// in the server adapter when a real analytics source is connected.
export function createDemoAnalytics(from: string, to: string, countries: CountrySales[] = [], catalog: Product[] = []): DailyAnalytics[] {
  const records: DailyAnalytics[] = [];
  const hourlyPattern = [0.12, 0.35, 0.8, 1.35, 1.1, 0.65, 0.25];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const day = parseDate(date);
    const seed = Math.floor(day.getTime() / 86_400_000);
    const seasonal = 1 + Math.sin(seed / 27) * 0.23 + Math.cos(seed / 81) * 0.15;
    const weekday = [0.55, 0.7, 0.95, 1.05, 1.2, 1.1, 0.8][day.getUTCDay()];
    const ordersByHour = hourlyPattern.map((weight, hour) => Math.max(0,
      Math.round(22 * weight * seasonal * weekday + Math.sin(seed * (hour + 1)) * 3)));
    const orders = ordersByHour.reduce((sum, value) => sum + value, 0);
    const record: DailyAnalytics = {
      date,
      ordersByHour,
      sales: orders * (27 + (seed % 11)),
      target: Math.round(2_700 * weekday * (1 + Math.sin(seed / 60) * 0.08)),
      customers: Math.round(orders * (0.22 + (seed % 7) / 100)),
      visits: Math.round(orders / (0.027 + (seed % 9) / 1_000)),
    };
    const countryCounts = distribute(orders, countries.map((country, index) => country.products * (1 + Math.sin(seed / (11 + index) + index) * 0.35)));
    record.countryOrders = Object.fromEntries(countries.map((country, index) => [country.code, countryCounts[index]]));
    const productCounts = distribute(orders, catalog.map((product, index) => product.sales * (1 + Math.cos(seed / (8 + index) + index) * 0.4)));
    const revenues = distribute(record.sales, productCounts);
    const views = distribute(record.visits, productCounts);
    record.products = Object.fromEntries(catalog.map((product, index) => [product.id, {
      sales: productCounts[index], revenue: revenues[index], views: views[index], reviews: Math.round(productCounts[index] * 0.12),
    }]));
    records.push(record);
  }
  return records;
}
