import { addDays, addMonths, formatDate, monthStart, parseDate, type DateRange } from "@/lib/date-range";
import type { CountrySales, DailyAnalytics, Metric, Product, SalesPoint } from "./types";

import { distribute } from "./distribute";

export const orderDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const orderHours = ["9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm"];
export type SalesInterval = "Hourly" | "Daily" | "Weekly" | "Monthly";

function totals(records: DailyAnalytics[]) {
  return records.reduce((sum, row) => ({
    sales: sum.sales + row.sales,
    orders: sum.orders + row.ordersByHour.reduce((a, b) => a + b, 0),
    customers: sum.customers + row.customers,
    visits: sum.visits + row.visits,
  }), { sales: 0, orders: 0, customers: 0, visits: 0 });
}

export function aggregateDashboard(records: DailyAnalytics[], range: DateRange, templates: Metric[], countryTemplates: CountrySales[] = [], productTemplates: Product[] = []) {
  const from = range.from;
  const to = range.to ?? from;
  const duration = Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86_400_000) + 1;
  if (duration < 1) throw new Error("Timeline end must not precede its start.");
  const previousFrom = addDays(from, -duration);
  const previousTo = addDays(from, -1);
  const selected = records.filter(row => row.date >= from && row.date <= to);
  const previous = records.filter(row => row.date >= previousFrom && row.date <= previousTo);
  const current = totals(selected);
  const before = totals(previous);
  const metricValues = (value: ReturnType<typeof totals>): Record<string, number> => ({
    revenue: value.sales,
    orders: value.orders,
    customers: value.customers,
    conversion: value.visits ? Math.round(value.orders / value.visits * 1_000) / 10 : 0,
  });
  const values = metricValues(current);
  const previousValues = metricValues(before);
  const metrics = templates.map(metric => ({
    ...metric,
    value: values[metric.id] ?? 0,
    change: previousValues[metric.id] ? Math.round((values[metric.id] / previousValues[metric.id] - 1) * 1_000) / 10 : null,
  }));

  const heatmap = orderHours.map(() => orderDays.map(() => 0));
  for (const record of selected) {
    const weekday = (parseDate(record.date).getUTCDay() + 6) % 7;
    record.ordersByHour.forEach((orders, hour) => { heatmap[hour][weekday] += orders; });
  }

  const interval: SalesInterval = duration === 1 ? "Hourly" : duration <= 31 ? "Daily" : duration <= 90 ? "Weekly" : "Monthly";
  const points: SalesPoint[] = [];
  if (selected.length && interval === "Hourly") {
    const weights = orderHours.map((_, hour) => selected.reduce((sum, record) => sum + record.ordersByHour[hour], 0));
    const sales = distribute(current.sales, weights);
    const targets = distribute(selected.reduce((sum, record) => sum + record.target, 0), weights);
    orderHours.forEach((label, hour) => points.push({ label, date: `${formatDate(from)} · ${label}`, sales: sales[hour], target: targets[hour] }));
  } else if (selected.length) {
    const buckets = new Map<string, SalesPoint>();
    for (let start = interval === "Monthly" ? monthStart(from) : from; start <= to;
      start = interval === "Monthly" ? addMonths(start, 1) : addDays(start, interval === "Weekly" ? 7 : 1)) {
      const date = start < from ? from : start;
      const end = interval === "Monthly" ? addDays(addMonths(start, 1), -1) : addDays(start, interval === "Weekly" ? 6 : 0);
      const label = parseDate(date).toLocaleDateString("en-GB", { ...(interval !== "Monthly" ? { day: "numeric" as const } : {}), ...(from.slice(0, 4) !== to.slice(0, 4) ? { year: "2-digit" as const } : {}), month: "short", timeZone: "UTC" });
      buckets.set(start, { label, date: end > date ? `${formatDate(date)} – ${formatDate(end < to ? end : to)}` : formatDate(date), sales: 0, target: 0 });
    }
    for (const record of selected) {
      const daysFromStart = Math.round((parseDate(record.date).getTime() - parseDate(from).getTime()) / 86_400_000);
      const key = interval === "Monthly" ? monthStart(record.date) : interval === "Weekly" ? addDays(from, Math.floor(daysFromStart / 7) * 7) : record.date;
      const point = buckets.get(key)!;
      point.sales += record.sales;
      point.target += record.target;
    }
    points.push(...buckets.values());
  }
  const countries = countryTemplates.map(country => ({
    ...country,
    products: selected.reduce((sum, record) => sum + (record.countryOrders?.[country.code] ?? 0), 0),
  })).filter(country => country.products > 0).sort((a, b) => b.products - a.products);
  const products = productTemplates.map(product => {
    const currentProduct = selected.reduce((sum, record) => {
      const item = record.products?.[product.id];
      return { sales: sum.sales + (item?.sales ?? 0), revenue: sum.revenue + (item?.revenue ?? 0), reviews: sum.reviews + (item?.reviews ?? 0), views: sum.views + (item?.views ?? 0) };
    }, { sales: 0, revenue: 0, reviews: 0, views: 0 });
    const previousSales = previous.reduce((sum, record) => sum + (record.products?.[product.id]?.sales ?? 0), 0);
    return { ...product, ...currentProduct, growth: previousSales ? Math.round((currentProduct.sales / previousSales - 1) * 1_000) / 10 : null };
  }).filter(product => product.sales > 0).sort((a, b) => b.revenue - a.revenue);
  return { metrics, heatmap, points, interval, countries, products, hasData: selected.length > 0, previousPeriod: { from: previousFrom, to: previousTo } };
}
