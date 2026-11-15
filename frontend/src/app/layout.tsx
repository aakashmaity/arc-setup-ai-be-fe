import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sky UI — Design System",
  description: "Explore the Sky UI component library, semantic tokens, and responsive patterns.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-theme="light" data-density="comfortable"><body>{children}</body></html>;
}
