"use client";

import { useCallback } from "react";
import type { EChartsOption } from "echarts";
import { Chart, type ChartTheme } from "@/components/ui/chart";
import type { OrderHeatmap } from "@/lib/dashboard/order-heatmap";
import { compact, number } from "@/lib/dashboard/format";
import { Panel } from "./panel";

export function OrdersHeatmap({ data, hasData }: { data: OrderHeatmap; hasData: boolean }) {
  const option = useCallback((theme: ChartTheme): EChartsOption => {
    const max = Math.max(4, ...data.cells.map(cell => cell.value[2]));
    const step = Math.ceil(max / 4);
    const unit = theme.unit;
    return {
      grid: { left: unit * 10, right: unit, top: unit * 10, bottom: unit * 6 },
      tooltip: {
        confine: true, renderMode: "richText", backgroundColor: theme.surface,
        borderColor: theme.grid, textStyle: { color: theme.text, fontSize: unit * 3 },
        formatter: params => {
          const item = Array.isArray(params) ? params[0] : params;
          const cell = data.cells[item.dataIndex];
          return `${cell.period}\n${number(cell.value[2])} orders`;
        },
      },
      xAxis: { type: "category", data: data.columns, splitArea: { show: false }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: theme.muted, hideOverlap: true, fontSize: unit * 2.75 } },
      yAxis: { type: "category", data: data.rows, inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: theme.muted, interval: 0, fontSize: unit * 2.75 } },
      visualMap: {
        type: "piecewise", dimension: 2, orient: "horizontal", left: "center", top: 0,
        itemSymbol: "circle", itemWidth: unit * 1.75, itemHeight: unit * 1.75, itemGap: unit * 2,
        textStyle: { color: theme.muted, fontSize: unit * 3 }, selectedMode: false,
        pieces: [
          { value: 0, label: "0", color: theme.heatmap[0] },
          ...[0, 1, 2, 3].map(index => ({ gt: index * step, ...(index < 3 ? { lte: (index + 1) * step } : {}), label: `${compact(index * step + 1)}+`, color: theme.heatmap[index + 1] })),
        ],
      },
      series: [{
        id: "orders", type: "heatmap", name: "Orders",
        data: data.cells,
        itemStyle: { borderWidth: unit, borderColor: theme.surface, borderRadius: unit * 1.5 },
        emphasis: {
          itemStyle: {
            color: "inherit",
            opacity: 0.65,
          },
        },
        progressive: 0,
      }],
    };
  }, [data]);
  return <Panel title="Orders by time">
    {hasData ? <Chart option={option} label={`${data.description} for the selected timeline. Hover or tap a cell for its dates and order count.`} /> : <p className="flex h-72 items-center justify-center text-sm text-muted-foreground sm:h-80">No orders in this timeline.</p>}
  </Panel>;
}
