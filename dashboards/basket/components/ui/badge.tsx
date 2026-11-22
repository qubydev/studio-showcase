import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="badge" className={cn("inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs leading-none font-medium", className)} {...props} />;
}
