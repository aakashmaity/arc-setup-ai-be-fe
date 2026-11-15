"use client";

import type { ComponentPropsWithRef } from "react";
import * as Primitive from "@radix-ui/react-accordion";
import { cn } from "../lib/utils";

export const Accordion = Primitive.Root;
export function AccordionItem({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Item>) {
  return <Primitive.Item className={cn("sky-border rounded-control border-border", className)} {...props} />;
}
export function AccordionTrigger({ className, children, ...props }: ComponentPropsWithRef<typeof Primitive.Trigger>) {
  return <Primitive.Header><Primitive.Trigger className={cn("sky-focus sky-disabled flex min-h-touch w-full items-center justify-between gap-control rounded-control px-panel py-control text-start text-label font-medium", className)} {...props}>
    {children}<span aria-hidden="true">⌄</span>
  </Primitive.Trigger></Primitive.Header>;
}
export function AccordionContent({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  return <Primitive.Content className={cn("px-panel pb-panel text-label leading-body text-muted-foreground", className)} {...props} />;
}
