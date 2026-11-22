export type DateRange = { from: string; to?: string };

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDate(value: string) {
  return new Date(`${value}T12:00:00Z`);
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

export function monthStart(value: string) {
  return `${value.slice(0, 7)}-01`;
}

export function addMonths(value: string, months: number) {
  const date = parseDate(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return dateKey(date);
}

export function selectRange(first: string, second: string): DateRange {
  if (first === second) return { from: first };
  return first < second ? { from: first, to: second } : { from: second, to: first };
}

export function formatDate(value: string, full = false) {
  return parseDate(value).toLocaleDateString("en-GB", {
    ...(full ? { weekday: "short" as const } : {}),
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export function formatRange(range: DateRange) {
  return range.to ? `${formatDate(range.from)} – ${formatDate(range.to)}` : formatDate(range.from, true);
}

export function datePresets(today: string) {
  const currentMonth = monthStart(today);
  const monday = addDays(today, -((parseDate(today).getUTCDay() + 6) % 7));
  const previousYear = parseDate(today).getUTCFullYear() - 1;
  return [
    { label: "Today", range: { from: today } },
    { label: "Last week", range: { from: addDays(monday, -7), to: addDays(monday, -1) } },
    { label: "Last month", range: { from: addMonths(currentMonth, -1), to: addDays(currentMonth, -1) } },
    { label: "Last 6 months", range: { from: addDays(addMonths(today, -6), 1), to: today } },
    { label: "Last year", range: { from: `${previousYear}-01-01`, to: `${previousYear}-12-31` } },
  ] satisfies { label: string; range: DateRange }[];
}
