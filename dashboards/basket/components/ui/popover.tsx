"use client";

import type { ComponentProps } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverTitle = PopoverPrimitive.Title;
export const PopoverDescription = PopoverPrimitive.Description;

type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<ComponentProps<typeof PopoverPrimitive.Positioner>, "align" | "side" | "sideOffset" | "anchor">;

export function PopoverContent({ className, align = "end", side = "bottom", sideOffset = 8, anchor, ...props }: PopoverContentProps) {
  return <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner anchor={anchor} align={align} side={side} sideOffset={sideOffset} className="z-60">
      <PopoverPrimitive.Popup data-slot="popover-content" className={cn("max-h-(--available-height) max-w-[calc(100vw---spacing(8))] overflow-y-auto rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl outline-none", className)} {...props} />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>;
}
