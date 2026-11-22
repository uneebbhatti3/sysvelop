import { Suspense } from "react";
import { getDashboardData } from "@/lib/enquiries";
import { requireAdmin } from "@/lib/auth";
import { purgeExpiredThrottled } from "@/lib/db";
import { SiteHeader } from "@/components/admin/site-header";
import { SectionCards } from "@/components/admin/section-cards";
import { EnquiriesChart } from "@/components/admin/enquiries-chart";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import { Skeleton } from "@/components/ui/skeleton";

// Layout from the shadcn dashboard-01 block. Session and data are read per request inside
// Suspense (cacheComponents); nothing here is cached or prerendered with data.
export default function AdminPage() {
  return (
    <>
      <SiteHeader title="Enquiries" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

async function Dashboard() {
  await requireAdmin();
  // Retention also runs here, so expired data goes even when no new enquiries arrive.
  await purgeExpiredThrottled();
  const data = await getDashboardData();

  return (
    <>
      <SectionCards stats={data.stats} />
      <div className="px-4 lg:px-6">
        <EnquiriesChart daily={data.daily} />
      </div>
      <EnquiriesTable enquiries={data.enquiries} total={data.stats.total} />
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-72" />
      <Skeleton className="h-96" />
    </div>
  );
}
