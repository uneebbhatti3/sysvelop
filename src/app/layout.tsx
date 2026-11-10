import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site, uiLabels } from "@/content/site";
import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/sections/footer";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {uiLabels.skipLink}
        </a>
        <div id="top" className="flex min-h-full flex-1 flex-col">
          <Nav />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
