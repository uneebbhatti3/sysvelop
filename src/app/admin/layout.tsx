import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Private area: never indexed, never linked from the public site.
export const metadata: Metadata = {
  title: "Admin | Sysvelop",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
