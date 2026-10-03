import Link from "next/link";
import { AlertTriangle, CalendarClock, MapPin, Receipt, Zap } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LINKS = [
  { href: "/operator/substations", label: "Substations", description: "Manage grid substations and capacity.", icon: Zap },
  { href: "/operator/areas", label: "Areas", description: "Feeder zones and which substation feeds them.", icon: MapPin },
  { href: "/operator/outages", label: "Outages", description: "Report and resolve outages.", icon: AlertTriangle },
  { href: "/operator/schedules", label: "Schedules", description: "Plan load-shedding windows.", icon: CalendarClock },
];

export default function OperatorOverviewPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Operator overview</h2>
          <p className="text-sm text-muted-foreground">Grid infrastructure, outages, schedules, and billing.</p>
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
