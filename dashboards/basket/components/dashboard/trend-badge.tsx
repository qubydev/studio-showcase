import { TrendingDown, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TrendBadge({ value, compact = false }: { value: number | null; compact?: boolean }) {
  if (value === null) return <Badge className="text-muted-foreground" title="No previous-period data" aria-label="No previous-period comparison">—</Badge>;
  const positive = value >= 0;
  const Icon = compact ? (positive ? ArrowUpRight : ArrowDownRight) : (positive ? TrendingUp : TrendingDown);
  return <Badge className={cn(positive ? "text-chart-2" : "text-chart-1", !compact && (positive ? "bg-chart-2/8" : "bg-chart-1/8"), compact && "px-0")} aria-label={`${positive ? "Up" : "Down"} ${Math.abs(value)} percent`}>
    <Icon className={compact ? "size-3" : "size-3.5"} />{!compact && positive ? "+" : ""}{value}%
  </Badge>;
}
