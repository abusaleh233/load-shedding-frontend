"use client";

import { format } from "date-fns";
import { CreditCard } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { useBills, usePayBill } from "@/hooks/use-bills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BillStatus } from "@/types/api";

const STATUS_VARIANT: Record<BillStatus, "warning" | "success" | "destructive" | "secondary"> = {
  UNPAID: "warning",
  PAID: "success",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    amount / 100
  );
}

export default function BillsPage() {
  const { data, isLoading } = useBills();
  const payBill = usePayBill();

  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR", "CONSUMER"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">My bills</h2>
          <p className="text-sm text-muted-foreground">Electricity bills and payment status.</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Billing period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-data text-xs">
                    {format(new Date(bill.billingPeriodStart), "PP")} – {format(new Date(bill.billingPeriodEnd), "PP")}
                  </TableCell>
                  <TableCell className="font-data">{formatAmount(bill.amountDue, bill.currency)}</TableCell>
                  <TableCell className="font-data text-xs">{format(new Date(bill.dueDate), "PP")}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[bill.status]}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {bill.status === "UNPAID" && (
                      <Button size="sm" onClick={() => payBill.mutate(bill.id)} disabled={payBill.isPending}>
                        <CreditCard className="h-4 w-4" />
                        Pay now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data?.bills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No bills yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </RoleGuard>
  );
}
