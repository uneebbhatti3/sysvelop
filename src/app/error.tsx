"use client";

import { errorPage } from "@/content/site";
import { buttonVariants } from "@/components/ui/button-variants";

// Shown if a page fails, for example when the database can't be reached.
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="container-x flex min-h-svh flex-col justify-center py-20">
      <h1 className="display max-w-[14ch] text-[clamp(3rem,1.3rem+5.6vw,7rem)] text-balance">{errorPage.heading}</h1>
      <button type="button" onClick={() => retry()} className={buttonVariants({ size: "pill", className: "mt-10 self-start" })}>
        {errorPage.retry}
      </button>
    </main>
  );
}
