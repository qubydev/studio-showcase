import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Panel({ title, action, children, className, contentClassName }: { title: string; action?: ReactNode; children: ReactNode; className?: string; contentClassName?: string }) {
  return <Card className={cn("min-w-0", className)}><CardHeader><CardTitle>{title}</CardTitle>{action}</CardHeader><CardContent className={cn("flex-1", contentClassName)}>{children}</CardContent></Card>;
}
