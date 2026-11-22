"use client";

import { useEffect, useRef } from "react";
import { init, use as registerCharts, type EChartsType } from "echarts/core";
import { HeatmapChart, LineChart } from "echarts/charts";
import { AriaComponent, GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

registerCharts([HeatmapChart, LineChart, GridComponent, LegendComponent, TooltipComponent, VisualMapComponent, AriaComponent, CanvasRenderer]);

export interface ChartTheme {
  text: string;
  muted: string;
  grid: string;
  surface: string;
  primary: string;
  comparison: string;
  heatmap: string[];
  font: string;
  unit: number;
}

function chartTheme(element: HTMLElement): ChartTheme {
  const style = getComputedStyle(element);
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  // Resolve CSS theme tokens to RGB so the chart library can interpolate them.
  const rgb = (value: string) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  };
  const token = (name: string) => rgb(style.getPropertyValue(name).trim());
  const primary = token("--primary");
  const surface = token("--card");
  return {
    text: token("--foreground"), muted: token("--muted-foreground"),
    grid: token("--grid"), surface, primary, comparison: token("--chart-2"),
    heatmap: [token("--grid"), ...[25, 45, 70, 100].map(percent => rgb(`color-mix(in srgb, ${primary} ${percent}%, ${surface})`))],
    font: style.fontFamily,
    unit: parseFloat(getComputedStyle(document.documentElement).fontSize) / 4,
  };
}

export function Chart({ option, label }: { option: (theme: ChartTheme) => EChartsOption; label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<EChartsType | null>(null);

  useEffect(() => {
    const element = container.current!;
    const chart = init(element, undefined, { renderer: "canvas" });
    instance.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element);
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) chart.resize(); });
    return () => {
      disposed = true;
      observer.disconnect();
      chart.dispose();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = instance.current!;
    const theme = chartTheme(container.current!);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => chart.setOption({
      ...option(theme),
      textStyle: { fontFamily: theme.font, fontSize: theme.unit * 3, color: theme.muted },
      animation: !motion.matches,
      animationDuration: 650,
      animationDurationUpdate: 450,
      animationEasing: "cubicOut",
      animationEasingUpdate: "cubicInOut",
      aria: { enabled: true },
    }, { notMerge: motion.matches, replaceMerge: ["series"] });
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, [option]);

  return <div ref={container} role="img" aria-label={label} className="h-72 w-full min-w-0 sm:h-80" />;
}
