"use client";

import type { ComponentProps } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;

type DropdownMenuContentProps = ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<ComponentProps<typeof MenuPrimitive.Positioner>, "align" | "side" | "sideOffset" | "alignOffset" | "anchor">;

export function DropdownMenuContent({
  className,
  align = "start",
  side = "bottom",
  sideOffset = 8,
  alignOffset = 0,
  anchor,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner anchor={anchor} side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} className="z-60">
        <MenuPrimitive.Popup data-slot="dropdown-menu-content" className={cn("max-h-(--available-height) min-w-50 max-w-[calc(100vw---spacing(8))] overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/40 outline-none", className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn("flex cursor-default items-center gap-3 rounded-lg p-2.5 text-xs outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className)} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return <MenuPrimitive.GroupLabel data-slot="dropdown-menu-label" className={cn("px-2.5 py-2 text-xs font-semibold", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1.5 my-1 h-0.25 bg-border", className)} {...props} />;
}
