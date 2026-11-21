import { uiLabels } from "@/content/site";
import { Nav } from "@/components/shared/nav";
import { Footer } from "@/components/sections/footer";
import { MotionProvider } from "@/components/motion/reveal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {uiLabels.skipLink}
      </a>
      {/* Scroll reveals start hidden; without JavaScript, show everything. */}
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <MotionProvider>
        <div id="top" className="flex min-h-full flex-1 flex-col">
          <Nav />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </div>
      </MotionProvider>
    </>
  );
}
