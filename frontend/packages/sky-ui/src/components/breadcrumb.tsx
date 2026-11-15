import type { ComponentPropsWithRef } from "react";
import { cn } from "../lib/utils";
export function Breadcrumb(props: ComponentPropsWithRef<"nav">) { return <nav aria-label="Breadcrumb" {...props} />; }
export function BreadcrumbList({ className, ...props }: ComponentPropsWithRef<"ol">) { return <ol className={cn("flex flex-wrap items-center gap-control text-label text-muted-foreground", className)} {...props} />; }
export function BreadcrumbItem({ className, ...props }: ComponentPropsWithRef<"li">) { return <li className={cn("inline-flex items-center gap-control", className)} {...props} />; }
export function BreadcrumbLink({ className, ...props }: ComponentPropsWithRef<"a">) { return <a className={cn("sky-focus inline-flex min-h-touch items-center hover:text-foreground", className)} {...props} />; }
export function BreadcrumbPage({ className, ...props }: ComponentPropsWithRef<"span">) { return <span aria-current="page" className={cn("text-foreground", className)} {...props} />; }
export function BreadcrumbSeparator({ children = "/", ...props }: ComponentPropsWithRef<"li">) { return <li aria-hidden="true" role="presentation" {...props}>{children}</li>; }
