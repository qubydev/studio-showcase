"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Popup>) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
    <DialogPrimitive.Popup className={cn("fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%---spacing(8))] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-popover p-6 shadow-2xl outline-none", className)} {...props}>
      {children}
      <DialogPrimitive.Close aria-label="Close dialog" className="absolute top-5 right-5 cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><X className="size-4" /></DialogPrimitive.Close>
    </DialogPrimitive.Popup>
  </DialogPrimitive.Portal>;
}
