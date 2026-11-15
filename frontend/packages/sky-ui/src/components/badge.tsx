import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const variants = cva("inline-flex items-center gap-control rounded-control px-inline py-control text-caption font-medium", {
  variants: { variant: {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-success text-success-foreground",
    outline: "sky-border border-border text-foreground",
  } }, defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }: ComponentPropsWithRef<"span"> & VariantProps<typeof variants>) {
  return <span className={cn(variants({ variant }), className)} {...props} />;
}
