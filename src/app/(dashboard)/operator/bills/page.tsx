"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useBills, useDeleteBill, useUpdateBill } from "@/hooks/use-bills";
import { BillForm } from "@/components/bills/bill-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Bill, BillStatus } from "@/types/api";

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

function OutstandingBillActions({ bill }: { bill: Bill }) {
  const isAdmin = useAuth().user?.role === "ADMIN";
  const updateMutation = useUpdateBill();
  const deleteMutation = useDeleteBill();
  const [editOpen, setEditOpen] = useState(false);

  const canEdit = bill.status !== "PAID";

  return (
    <div className="flex justify-end gap-1">
      {canEdit && (
        <>
          <Button
            variant="ghost"
            size="sm"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ id: bill.id, input: { status: "OVERDUE" } })}
          >
            Mark overdue
          </Button>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit bill</DialogTitle>
              </DialogHeader>
              <BillForm bill={bill} onDone={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      )}
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (window.confirm("Delete this bill? This can't be undone.")) {
              deleteMutation.mutate(bill.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}

function BillsContent() {
  const { data, isLoading } = useBills();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Bills</h2>
          <p className="text-sm text-muted-foreground">Every consumer bill across the system.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New bill</DialogTitle>
            </DialogHeader>
            <BillForm onDone={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Consumer</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="text-sm">{bill.user?.name ?? "—"}</TableCell>
                <TableCell className="font-data text-xs">
                  {format(new Date(bill.billingPeriodStart), "PP")} – {format(new Date(bill.billingPeriodEnd), "PP")}
                </TableCell>
                <TableCell className="font-data">{formatAmount(bill.amountDue, bill.currency)}</TableCell>
                <TableCell className="font-data text-xs">{format(new Date(bill.dueDate), "PP")}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[bill.status]}>{bill.status}</Badge>
                </TableCell>
                <TableCell>
                  <OutstandingBillActions bill={bill} />
                </TableCell>
              </TableRow>
            ))}
            {data?.bills.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No bills yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function BillsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <BillsContent />
    </RoleGuard>
  );
}
