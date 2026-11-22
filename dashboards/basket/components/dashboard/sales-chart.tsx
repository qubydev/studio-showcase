"use client";

import { useCallback } from "react";
import type { EChartsOption } from "echarts";
import { Chart, type ChartTheme } from "@/components/ui/chart";
import { compact, currency } from "@/lib/dashboard/format";
import type { SalesPoint } from "@/lib/dashboard/types";
import type { SalesInterval } from "@/lib/dashboard/analytics";
import { Panel } from "./panel";

export function SalesChart({ data, interval }: { data: SalesPoint[]; interval: SalesInterval }) {
  const option = useCallback((theme: ChartTheme): EChartsOption => {
    const unit = theme.unit;
    return {
      color: [theme.primary, theme.comparison],
      grid: { left: unit * 13, right: unit * 4, top: unit * 11, bottom: unit * 7 },
      legend: { data: ["Sales", "Target"], right: 0, top: 0, icon: "roundRect", itemWidth: unit * 3, itemHeight: unit / 2, textStyle: { color: theme.muted, fontSize: unit * 3 } },
      tooltip: {
        trigger: "axis", confine: true, renderMode: "richText",
        backgroundColor: theme.surface, borderColor: theme.grid,
        textStyle: { color: theme.text, fontSize: unit * 3 },
        axisPointer: { type: "line", lineStyle: { color: theme.muted, type: "dashed" } },
        formatter: params => {
          const items = Array.isArray(params) ? params : [params];
          const point = data[items[0]?.dataIndex];
          if (!point) return "";
          return [point.date, ...items.map(item => `${item.seriesName}: ${currency(Number(item.value))}`)].join("\n");
        },
      },
      xAxis: { type: "category", boundaryGap: false, data: data.map(point => point.label), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: theme.muted, hideOverlap: true, margin: unit * 3, fontSize: unit * 2.75 } },
      yAxis: { type: "value", min: 0, splitNumber: 4, axisLabel: { color: theme.muted, formatter: (value: number) => compact(value), fontSize: unit * 2.75 }, splitLine: { lineStyle: { color: theme.grid } } },
      series: (["sales", "target"] as const).map((key, index) => ({
        id: key, name: index === 0 ? "Sales" : "Target", type: "line", smooth: 0.35,
        showSymbol: data.length === 1, symbol: "circle", symbolSize: unit * 2,
        lineStyle: { width: unit / 2 },
        emphasis: { focus: "series", scale: true },
        data: data.map(point => ({ name: point.date, value: point[key] })),
      })),
    };
  }, [data]);
  return <Panel title={`${interval} sales performance`}>
    {data.length ? <Chart option={option} label={`${interval} sales and targets for the selected timeline. Hover or tap to inspect values; use the legend to toggle series.`} /> : <p className="flex h-72 items-center justify-center text-sm text-muted-foreground sm:h-80">No sales in this timeline.</p>}
  </Panel>;
}
