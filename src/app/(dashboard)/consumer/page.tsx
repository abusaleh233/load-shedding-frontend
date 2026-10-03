import { RoleGuard } from "@/components/layout/role-guard";
import { LiveOutageList } from "@/components/outages/live-outage-list";

export default function ConsumerDashboardPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR", "CONSUMER"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Live outages in your area</h2>
          <p className="text-sm text-muted-foreground">
            Reported and in-progress outages, refreshed automatically every 30 seconds.
          </p>
        </div>
        <LiveOutageList />
      </div>
    </RoleGuard>
  );
}
