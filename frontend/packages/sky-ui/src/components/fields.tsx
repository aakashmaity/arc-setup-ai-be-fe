import type { ComponentPropsWithRef } from "react";
import { cn } from "../lib/utils";

const fieldClass = "w-full min-w-0 rounded-control sky-border border-input bg-background px-inline py-control text-body tablet:text-label sky-focus disabled:cursor-not-allowed sky-disabled aria-invalid:border-destructive";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return <input className={cn(fieldClass, "h-field min-h-touch tablet:min-h-field", className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentPropsWithRef<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-textarea", className)} {...props} />;
}
export function Label({ className, ...props }: ComponentPropsWithRef<"label">) {
  return <label className={cn("text-label font-medium", className)} {...props} />;
}
export function Checkbox({ className, ...props }: Omit<ComponentPropsWithRef<"input">, "type">) {
  return <input type="checkbox" className={cn("size-choice accent-primary sky-focus sky-disabled", className)} {...props} />;
}
