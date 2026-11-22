import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendBadge } from "./trend-badge";
import type { Metric } from "@/lib/dashboard/types";
import { number } from "@/lib/dashboard/format";

export function MetricCard({ metric }: { metric: Metric }) {
  return <Card className="min-w-0">
    <CardHeader className="flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:px-3 max-sm:pt-3 max-sm:pb-3"><CardTitle className="max-sm:text-xs">{metric.label}</CardTitle><TrendBadge value={metric.change} /></CardHeader>
    <CardContent className="max-sm:px-3 max-sm:pb-4">
      <p className="text-2xl leading-none font-semibold tracking-tight tabular-nums sm:text-3xl">
        {metric.format === "currency" && <span className="mr-1.5">$</span>}{number(metric.value)}{metric.format === "percent" && <span className="ml-1.5">%</span>}
      </p>
    </CardContent>
  </Card>;
}
