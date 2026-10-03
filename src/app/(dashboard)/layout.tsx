"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_TITLES: Record<string, string> = {
  "/consumer": "Live outages",
  "/consumer/bills": "My bills",
  "/consumer/payments": "Payment history",
  "/operator": "Operator overview",
  "/operator/substations": "Substations",
  "/operator/areas": "Areas",
  "/operator/outages": "Outages",
  "/operator/schedules": "Schedules",
  "/operator/schedules/new": "New schedule",
  "/operator/bills": "Bills",
  "/admin": "Admin overview",
  "/admin/payments": "All payments",
  "/admin/audit-logs": "Audit logs",
  "/admin/users": "Users",
  "/profile": "My profile",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isHydrated } = useAuth();

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-60 shrink-0 border-r border-border bg-card md:block" />
        <div className="flex-1 space-y-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar title={PAGE_TITLES[pathname] ?? "Dashboard"} />
        <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
