import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Basket — Store overview",
  description: "Your store at a glance. Explore revenue, orders, customers, and product performance with Basket.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none motion-reduce:[&_*::before]:animate-none motion-reduce:[&_*::before]:transition-none motion-reduce:[&_*::after]:animate-none motion-reduce:[&_*::after]:transition-none`}
    >
      <body className="flex min-h-full flex-col text-sm">{children}</body>
    </html>
  );
}
