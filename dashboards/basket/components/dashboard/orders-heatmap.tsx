"use client";

import { useCallback } from "react";
import type { EChartsOption } from "echarts";
import { Chart, type ChartTheme } from "@/components/ui/chart";
import { orderDays, orderHours } from "@/lib/dashboard/analytics";
import { compact, number } from "@/lib/dashboard/format";
import { Panel } from "./panel";

export function OrdersHeatmap({ values, hasData }: { values: number[][]; hasData: boolean }) {
  const option = useCallback((theme: ChartTheme): EChartsOption => {
    const max = Math.max(4, ...values.flat());
    const step = Math.ceil(max / 4);
    const unit = theme.unit;
    return {
      grid: { left: unit * 10, right: unit, top: unit * 10, bottom: unit * 6 },
      tooltip: {
        confine: true, renderMode: "richText", backgroundColor: theme.surface,
        borderColor: theme.grid, textStyle: { color: theme.text, fontSize: unit * 3 },
        formatter: params => {
          const item = Array.isArray(params) ? params[0] : params;
          const [day, hour, count] = item.value as number[];
          return `${orderDays[day]} · ${orderHours[hour]}\n${number(count)} orders`;
        },
      },
      xAxis: { type: "category", data: orderDays, splitArea: { show: false }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: theme.muted, interval: 0, fontSize: unit * 2.75 } },
      yAxis: { type: "category", data: orderHours, inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: theme.muted, fontSize: unit * 2.75 } },
      visualMap: {
        type: "piecewise", orient: "horizontal", left: "center", top: 0,
        itemSymbol: "circle", itemWidth: unit * 1.75, itemHeight: unit * 1.75, itemGap: unit * 2,
        textStyle: { color: theme.muted, fontSize: unit * 3 }, selectedMode: false,
        pieces: [
          { value: 0, label: "0", color: theme.heatmap[0] },
          ...[0, 1, 2, 3].map(index => ({ gt: index * step, ...(index < 3 ? { lte: (index + 1) * step } : {}), label: `${compact(index * step + 1)}+`, color: theme.heatmap[index + 1] })),
        ],
      },
      series: [{
        id: "orders", type: "heatmap", name: "Orders",
        data: values.flatMap((row, hour) => row.map((count, day) => [day, hour, count])),
        itemStyle: { borderWidth: unit, borderColor: theme.surface, borderRadius: unit * 1.5 },
        emphasis: { itemStyle: { borderColor: theme.text, borderWidth: unit / 2 } },
        progressive: 0,
      }],
    };
  }, [values]);
  return <Panel title="Orders by time">
    {hasData ? <Chart option={option} label="Orders by weekday and hour for the selected timeline. Hover or tap a cell for its order count." /> : <p className="flex h-72 items-center justify-center text-sm text-muted-foreground sm:h-80">No orders in this timeline.</p>}
  </Panel>;
}
