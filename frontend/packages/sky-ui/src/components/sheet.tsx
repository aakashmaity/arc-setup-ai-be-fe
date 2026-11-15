"use client";

import type { ComponentPropsWithRef } from "react";
import * as Primitive from "@radix-ui/react-dialog";
import { Button } from "./button";
import { cn } from "../lib/utils";
export { DialogTitle as SheetTitle, DialogDescription as SheetDescription, DialogFooter as SheetFooter } from "./dialog";
export const Sheet = Primitive.Root;
export const SheetTrigger = Primitive.Trigger;
export const SheetClose = Primitive.Close;

export function SheetContent({ children, className, side = "right", closeLabel = "Close panel", ...props }: ComponentPropsWithRef<typeof Primitive.Content> & { side?: "left" | "right"; closeLabel?: string }) {
  return <Primitive.Portal>
    <Primitive.Overlay className="sky-overlay fixed inset-0 bg-overlay" />
    <Primitive.Content className={cn("sky-modal fixed inset-y-0 grid h-dvh w-full content-start gap-stack overflow-y-auto bg-popover p-panel text-popover-foreground shadow-floating tablet:max-w-sheet", side === "right" ? "right-0" : "left-0", className)} {...props}>
      <Primitive.Close asChild><Button variant="ghost" className="justify-self-end" aria-label={closeLabel}>{closeLabel}</Button></Primitive.Close>
      {children}
    </Primitive.Content>
  </Primitive.Portal>;
}
