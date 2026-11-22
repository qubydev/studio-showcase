import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cn("flex flex-col rounded-3xl bg-card text-card-foreground", className)} {...props} />;
}
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex items-center justify-between gap-3 px-5 pt-5 pb-4 lg:max-xl:px-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 data-slot="card-title" className={cn("text-sm leading-5 font-medium tracking-tight", className)} {...props} />;
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5 pb-5 lg:max-xl:px-4", className)} {...props} />;
}
