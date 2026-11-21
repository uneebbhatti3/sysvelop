import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

// Full SEO metadata (canonical, Open Graph, JSON-LD) arrives in Phase 4.
export const metadata: Metadata = {
  title: `${site.name} | The digital systems behind growing businesses`,
  description:
    "Sysvelop builds fast websites, apps, and AI automation for small businesses, with online booking and workflows that keep the business moving.",
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
  colorScheme: "light",
};

// Shared shell only. Public chrome lives in (site)/layout.tsx; the admin has its own.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
