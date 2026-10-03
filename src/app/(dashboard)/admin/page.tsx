import Link from "next/link";
import { AlertTriangle, CalendarClock, CreditCard, FileText, MapPin, Receipt, Users, Zap } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LINKS = [
  { href: "/operator/substations", label: "Substations", description: "Manage grid substations and capacity.", icon: Zap },
  { href: "/operator/areas", label: "Areas", description: "Feeder zones and which substation feeds them.", icon: MapPin },
  { href: "/operator/outages", label: "Outages", description: "Report and resolve outages.", icon: AlertTriangle },
  { href: "/operator/schedules", label: "Schedules", description: "Planned load-shedding windows.", icon: CalendarClock },
  { href: "/operator/bills", label: "Bills", description: "Issue and manage consumer bills.", icon: Receipt },
  { href: "/admin/payments", label: "All payments", description: "Every payment attempt, every consumer.", icon: CreditCard },
  { href: "/admin/audit-logs", label: "Audit logs", description: "Review every critical action taken.", icon: FileText },
  { href: "/admin/users", label: "Users", description: "Manage roles and accounts.", icon: Users },
];

export default function AdminOverviewPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Admin overview</h2>
          <p className="text-sm text-muted-foreground">System-wide oversight: infrastructure, billing, and audit.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{label}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
