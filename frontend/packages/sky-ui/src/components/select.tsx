"use client";

import * as React from "react";
import * as Primitive from "@radix-ui/react-select";
import { cn } from "../lib/utils";

export const Select = Primitive.Root;
export const SelectValue = Primitive.Value;
export const SelectGroup = Primitive.Group;
export const SelectLabel = Primitive.Label;

export function SelectTrigger({ children, className, ...props }: React.ComponentPropsWithRef<typeof Primitive.Trigger>) {
  return <Primitive.Trigger className={cn("flex h-field min-h-touch tablet:min-h-field w-full items-center justify-between gap-control rounded-control sky-border border-input bg-background px-inline text-label sky-focus sky-disabled", className)} {...props}>
    {children}<Primitive.Icon aria-hidden>▾</Primitive.Icon>
  </Primitive.Trigger>;
}
export function SelectContent({ children, className, position = "popper", ...props }: React.ComponentPropsWithRef<typeof Primitive.Content>) {
  return <Primitive.Portal><Primitive.Content position={position} className={cn("sky-popover sky-select-content overflow-hidden rounded-control sky-border border-input bg-popover text-popover-foreground shadow-raised", className)} {...props}>
    <Primitive.ScrollUpButton className="text-center">▴</Primitive.ScrollUpButton>
    <Primitive.Viewport className="p-control">{children}</Primitive.Viewport>
    <Primitive.ScrollDownButton className="text-center">▾</Primitive.ScrollDownButton>
  </Primitive.Content></Primitive.Portal>;
}
export function SelectItem({ children, className, ...props }: React.ComponentPropsWithRef<typeof Primitive.Item>) {
  return <Primitive.Item className={cn("relative flex min-h-touch tablet:min-h-field cursor-default select-none items-center rounded-control py-control sky-select-item pe-inline text-label outline-none focus:bg-secondary data-[disabled]:pointer-events-none sky-disabled", className)} {...props}>
    <span className="absolute start-inline"><Primitive.ItemIndicator>✓</Primitive.ItemIndicator></span>
    <Primitive.ItemText>{children}</Primitive.ItemText>
  </Primitive.Item>;
}
