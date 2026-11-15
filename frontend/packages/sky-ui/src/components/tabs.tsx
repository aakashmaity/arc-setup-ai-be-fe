"use client";

import type { ComponentPropsWithRef } from "react";
import * as Primitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

export const Tabs = Primitive.Root;
export function TabsList({ className, ...props }: ComponentPropsWithRef<typeof Primitive.List>) {
  return <Primitive.List className={cn("flex w-full gap-control overflow-x-auto rounded-control bg-muted p-control data-[orientation=vertical]:flex-col", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Trigger>) {
  return <Primitive.Trigger className={cn("sky-focus sky-disabled sky-transition min-h-touch shrink-0 rounded-control px-inline py-control text-label text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-card-foreground tablet:min-h-field", className)} {...props} />;
}
export function TabsContent({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  return <Primitive.Content className={cn("sky-focus min-w-0 py-panel", className)} {...props} />;
}
