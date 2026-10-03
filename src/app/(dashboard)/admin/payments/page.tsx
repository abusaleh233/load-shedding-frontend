"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { useAllPayments } from "@/hooks/use-payments";
import { PaymentHistoryTable } from "@/components/payments/payment-history-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllPaymentsPage() {
  const { data, isLoading } = useAllPayments();

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">All payments</h2>
          <p className="text-sm text-muted-foreground">Every payment attempt across every consumer.</p>
        </div>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <PaymentHistoryTable payments={data?.payments ?? []} showUser />
        )}
      </div>
    </RoleGuard>
  );
}
