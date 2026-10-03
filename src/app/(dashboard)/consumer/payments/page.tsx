"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { usePaymentHistory } from "@/hooks/use-payments";
import { PaymentHistoryTable } from "@/components/payments/payment-history-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentHistoryPage() {
  const { data, isLoading } = usePaymentHistory();

  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR", "CONSUMER"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Payment history</h2>
          <p className="text-sm text-muted-foreground">Every checkout you've started, and how it resolved.</p>
        </div>
        {isLoading ? <Skeleton className="h-64 w-full" /> : <PaymentHistoryTable payments={data?.payments ?? []} />}
      </div>
    </RoleGuard>
  );
}
