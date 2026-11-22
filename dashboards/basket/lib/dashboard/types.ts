export interface Metric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number | null;
}

export interface DailyAnalytics {
  date: string;
  ordersByHour: number[];
  sales: number;
  target: number;
  customers: number;
  visits: number;
  countryOrders?: Record<string, number>;
  products?: Record<string, { sales: number; revenue: number; reviews: number; views: number }>;
}

export interface SalesPoint {
  label: string;
  date: string;
  sales: number;
  target: number;
}

export interface CountrySales {
  code: string;
  name: string;
  products: number;
}

export interface Product {
  id: string;
  name: string;
  revenue: number;
  sales: number;
  growth: number | null;
  reviews: number;
  views: number;
}

export interface DashboardData {
  brand: string;
  user: { name: string; email: string; initials: string; role: string };
  date: string;
  period: { start: string; end: string };
  metrics: Metric[];
  analytics: DailyAnalytics[];
  countries: CountrySales[];
  products: Product[];
  notifications: { id: string; title: string; detail: string; time: string }[];
}
