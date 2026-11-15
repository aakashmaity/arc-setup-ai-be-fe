"use client";

import type { ComponentPropsWithRef } from "react";
import * as Primitive from "@radix-ui/react-dialog";
import { Button } from "./button";
import { cn } from "../lib/utils";

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;

export function DialogContent({ children, className, closeLabel = "Close dialog", ...props }: ComponentPropsWithRef<typeof Primitive.Content> & { closeLabel?: string }) {
  return <Primitive.Portal>
    <Primitive.Overlay className="sky-overlay fixed inset-0 bg-overlay" />
    <Primitive.Content className={cn("sky-modal sky-modal-fit sky-border fixed start-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-stack overflow-y-auto rounded-modal border-border bg-popover p-panel text-popover-foreground shadow-floating tablet:max-w-dialog", className)} {...props}>
      <Primitive.Close asChild><Button variant="ghost" className="justify-self-end" aria-label={closeLabel}>{closeLabel}</Button></Primitive.Close>
      {children}
    </Primitive.Content>
  </Primitive.Portal>;
}
export function DialogTitle({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Title>) {
  return <Primitive.Title className={cn("text-title font-semibold leading-title", className)} {...props} />;
}
export function DialogDescription({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Description>) {
  return <Primitive.Description className={cn("text-label leading-body text-muted-foreground", className)} {...props} />;
}
export function DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("flex flex-col gap-control tablet:flex-row tablet:justify-end", className)} {...props} />;
}
