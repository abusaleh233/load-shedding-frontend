"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Payment, PaymentStatus } from "@/types/api";

const STATUS_VARIANT: Record<PaymentStatus, "warning" | "success" | "destructive" | "secondary"> = {
  PENDING: "warning",
  SUCCEEDED: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    amount / 100
  );
}

export function PaymentHistoryTable({ payments, showUser = false }: { payments: Payment[]; showUser?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          {showUser && <TableHead>Consumer</TableHead>}
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-data text-xs whitespace-nowrap">
              {format(new Date(payment.createdAt), "PP p")}
            </TableCell>
            {showUser && (
              <TableCell className="text-sm">
                {payment.user ? (
                  <div className="flex flex-col">
                    <span>{payment.user.name}</span>
                    <span className="text-xs text-muted-foreground">{payment.user.email}</span>
                  </div>
                ) : (
                  "—"
                )}
              </TableCell>
            )}
            <TableCell className="font-data">{formatAmount(payment.amount, payment.currency)}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[payment.status]}>{payment.status}</Badge>
            </TableCell>
            <TableCell className="font-data text-xs text-muted-foreground">{payment.id.slice(0, 8)}</TableCell>
          </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow>
            <TableCell colSpan={showUser ? 5 : 4} className="text-center text-muted-foreground">
              No payments yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
