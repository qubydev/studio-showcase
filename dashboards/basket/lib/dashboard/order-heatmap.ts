import { addDays, addMonths, formatDate, monthStart, parseDate, type DateRange } from "@/lib/date-range";
import type { DailyAnalytics } from "./types";

export const orderDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const orderHours = ["9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm"];

export interface OrderHeatmap {
  columns: string[];
  rows: string[];
  cells: { value: [number, number, number]; period: string }[];
  description: string;
}

export function aggregateOrderHeatmap(records: DailyAnalytics[], range: DateRange, duration: number): OrderHeatmap {
  const from = range.from;
  const to = range.to ?? from;
  const mode = duration <= 7 ? "hours" : duration <= 90 ? "days" : duration <= 730 ? "months" : "years";
  const rows = mode === "hours" ? orderHours : mode === "days" ? orderDays : mode === "months"
    ? ["1–7", "8–14", "15–21", "22–28", "29–31"]
    : Array.from({ length: 12 }, (_, month) => parseDate(`2000-${String(month + 1).padStart(2, "0")}-01`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }));
  const columns: string[] = [];
  const cells: OrderHeatmap["cells"] = [];
  const buckets = new Map<string, OrderHeatmap["cells"][number]>();
  const shortDate = (date: string) => parseDate(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const first = mode === "hours" ? from : mode === "days" ? addDays(from, -((parseDate(from).getUTCDay() + 6) % 7)) : mode === "months" ? monthStart(from) : `${from.slice(0, 4)}-01-01`;

  for (let start = first; start <= to; start = mode === "hours" ? addDays(start, 1) : mode === "days" ? addDays(start, 7) : addMonths(start, mode === "months" ? 1 : 12)) {
    const column = columns.length;
    columns.push(mode === "hours" ? (duration === 1 ? shortDate(start) : `${orderDays[(parseDate(start).getUTCDay() + 6) % 7]} ${parseDate(start).getUTCDate()}`)
      : mode === "days" ? shortDate(start)
      : mode === "months" ? parseDate(start).toLocaleDateString("en-GB", { month: "short", ...(from.slice(0, 4) !== to.slice(0, 4) ? { year: "2-digit" as const } : {}), timeZone: "UTC" })
      : start.slice(0, 4));
    rows.forEach((_, row) => {
      let cellFrom = mode === "hours" ? start : mode === "days" ? addDays(start, row) : mode === "months" ? addDays(start, row * 7) : addMonths(start, row);
      let cellTo = mode === "months" ? (row === 4 ? addDays(addMonths(start, 1), -1) : addDays(cellFrom, 6)) : mode === "years" ? addDays(addMonths(cellFrom, 1), -1) : cellFrom;
      if (cellFrom > cellTo || cellFrom > to || cellTo < from) return;
      if (cellFrom < from) cellFrom = from;
      if (cellTo > to) cellTo = to;
      const period = mode === "hours" ? `${formatDate(cellFrom)} · ${orderHours[row]}` : cellFrom === cellTo ? formatDate(cellFrom, true) : `${formatDate(cellFrom)} – ${formatDate(cellTo)}`;
      const cell: OrderHeatmap["cells"][number] = { value: [column, row, 0], period };
      cells.push(cell);
      buckets.set(`${start}:${row}`, cell);
    });
  }

  for (const record of records) {
    if (record.date < from || record.date > to) continue;
    const date = parseDate(record.date);
    if (mode === "hours") {
      record.ordersByHour.forEach((orders, hour) => {
        const cell = buckets.get(`${record.date}:${hour}`);
        if (cell) cell.value[2] += orders;
      });
    } else {
      const weekday = (date.getUTCDay() + 6) % 7;
      const start = mode === "days" ? addDays(record.date, -weekday) : mode === "months" ? monthStart(record.date) : `${record.date.slice(0, 4)}-01-01`;
      const row = mode === "days" ? weekday : mode === "months" ? Math.floor((date.getUTCDate() - 1) / 7) : date.getUTCMonth();
      const cell = buckets.get(`${start}:${row}`);
      if (cell) cell.value[2] += record.ordersByHour.reduce((sum, orders) => sum + orders, 0);
    }
  }
  return { columns, rows, cells, description: mode === "hours" ? "Orders by date and hour" : mode === "days" ? "Daily orders by calendar week and weekday" : mode === "months" ? "Weekly order totals by month and day of month" : "Monthly order totals by year and month" };
}
