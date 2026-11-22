import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { countOpenEnquiries } from "@/lib/enquiries";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

// Shared dashboard chrome. This is not the auth boundary: layouts don't re-render on
// navigation, so every page and action also calls requireAdmin().
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const open = await countOpenEnquiries();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" open={open} />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}

function ShellSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" className="flex min-h-svh gap-4 p-4">
      <Skeleton className="hidden w-60 md:block" />
      <Skeleton className="h-96 flex-1" />
    </div>
  );
}
