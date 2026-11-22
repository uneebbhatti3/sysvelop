import { Suspense } from "react";
import { SiteHeader } from "@/components/admin/site-header";
import { Skeleton } from "@/components/ui/skeleton";

/** Page frame for the content screens. Children read the session and data, so they suspend. */
export function ContentPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader title={title} />
      <div className="w-full max-w-5xl px-4 py-6 lg:px-6">
        <Suspense
          fallback={
            <div role="status" aria-busy="true" aria-label="Loading" className="flex flex-col gap-4">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-80" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </>
  );
}

export function SetupNotice() {
  return (
    <p role="status" className="rounded-lg border bg-card p-4 text-sm leading-relaxed">
      The database isn&apos;t set up for this page yet. Run <code className="font-semibold">npm run db:migrate</code>,
      then reload. The public site keeps showing its built-in content until then.
    </p>
  );
}
