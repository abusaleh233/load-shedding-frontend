"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteOutage, useOutages, useUpdateOutage } from "@/hooks/use-outages";
import { OutageForm } from "@/components/outages/outage-form";
import { OutageStatusBadge, PriorityBadge } from "@/components/outages/outage-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OutageLogStatus } from "@/types/api";

const STATUS_OPTIONS: OutageLogStatus[] = ["REPORTED", "IN_PROGRESS", "RESOLVED"];

function OutagesContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading } = useOutages();
  const updateMutation = useUpdateOutage();
  const deleteMutation = useDeleteOutage();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Outages</h2>
          <p className="text-sm text-muted-foreground">Every reported and scheduled outage, oldest first.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Report outage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an outage</DialogTitle>
            </DialogHeader>
            <OutageForm onDone={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.outages.map((outage) => (
              <TableRow key={outage.id}>
                <TableCell>{outage.area?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {outage.type === "EMERGENCY" ? "Emergency" : "Scheduled"}
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={outage.priority} />
                </TableCell>
                <TableCell className="font-data text-xs">
                  {formatDistanceToNow(new Date(outage.startTime), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <OutageStatusBadge status={outage.status} />
                    <Select
                      value={outage.status}
                      disabled={updateMutation.isPending}
                      onValueChange={(status) =>
                        updateMutation.mutate({ id: outage.id, input: { status: status as OutageLogStatus } })
                      }
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm("Delete this outage record? This can't be undone.")) {
                          deleteMutation.mutate(outage.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {data?.outages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No outages recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function OutagesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <OutagesContent />
    </RoleGuard>
  );
}
