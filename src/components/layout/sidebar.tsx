"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Receipt,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}


const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  CONSUMER: [
    { href: "/consumer", label: "Live outages", icon: Activity },
    { href: "/consumer/bills", label: "My bills", icon: Receipt },
    { href: "/consumer/payments", label: "Payment history", icon: CreditCard },
  ],
  OPERATOR: [
    { href: "/operator", label: "Overview", icon: Home },
    { href: "/operator/substations", label: "Substations", icon: Zap },
    { href: "/operator/areas", label: "Areas", icon: MapPin },
    { href: "/operator/outages", label: "Outages", icon: AlertTriangle },
    { href: "/operator/schedules", label: "Schedules", icon: CalendarClock },
    
  ],
  ADMIN: [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/operator/substations", label: "Substations", icon: Zap },
    { href: "/operator/areas", label: "Areas", icon: MapPin },
    { href: "/operator/outages", label: "Outages", icon: AlertTriangle },
    { href: "/operator/schedules", label: "Schedules", icon: CalendarClock },
    { href: "/operator/bills", label: "Bills", icon: Receipt },
    { href: "/admin/payments", label: "All payments", icon: CreditCard },
    { href: "/admin/audit-logs", label: "Audit logs", icon: FileText },
    { href: "/admin/users", label: "Users", icon: Users },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Zap  className="h-5 w-5 text-primary" />
          Grid Control
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
