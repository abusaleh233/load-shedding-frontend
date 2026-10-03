import { RoleGuard } from "@/components/layout/role-guard";
import { AuditLogTable } from "@/components/audit/audit-log-table";

export default function AuditLogsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Audit logs</h2>
          <p className="text-sm text-muted-foreground">
            Every critical action across the system — creates, updates, deletes, and auth events.
          </p>
        </div>
        <AuditLogTable />
      </div>
    </RoleGuard>
  );
}
