"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "./metric-card";
import { OrdersHeatmap } from "./orders-heatmap";
import { SalesChart } from "./sales-chart";
import { CountrySales } from "./country-sales";
import { ProductSales } from "./product-sales";
import { useTimeline } from "@/hooks/use-timeline";
import { aggregateDashboard } from "@/lib/dashboard/analytics";
import type { Section } from "@/components/layout/app-sidebar";
import type { DashboardData } from "@/lib/dashboard/types";

export function Dashboard({ data }: { data: DashboardData }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Section>("Dashboard");
  const [range, setRange] = useTimeline(data.date);
  const analytics = useMemo(() => aggregateDashboard(data.analytics, { from: range.from, to: range.to }, data.metrics, data.countries, data.products), [data.analytics, data.metrics, data.countries, data.products, range.from, range.to]);
  const search = query.trim().toLowerCase();
  const countries = analytics.countries.filter(country => `${country.name} ${country.code}`.toLowerCase().includes(search));
  const products = analytics.products.filter(product => product.name.toLowerCase().includes(search));
  return <DashboardShell selectedRange={range} onRangeChange={setRange} data={data} query={query} onQueryChange={setQuery} active={active} onNavigate={section => { setActive(section); setQuery(""); }}>
    <h1 className="sr-only">{active}</h1>
    {active === "Dashboard" && <>
    <section aria-label="Store overview" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
      {analytics.metrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
    </section>
    <section aria-label="Sales and order analytics" className="mt-4 grid grid-cols-1 gap-4 xl:mt-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-6">
      <OrdersHeatmap values={analytics.heatmap} hasData={analytics.hasData} />
      <SalesChart data={analytics.points} interval={analytics.interval} />
    </section>
    <section aria-label="Country and product sales" className="mt-4 grid grid-cols-1 gap-4 xl:mt-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-6">
      <CountrySales countries={countries} />
      <ProductSales products={products} />
    </section>
    </>}
  </DashboardShell>;
}
