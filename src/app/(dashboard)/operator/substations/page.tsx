"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteSubstation, useSubstations } from "@/hooks/use-substations";
import { SubstationForm } from "@/components/substations/substation-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Substation, SubstationStatus } from "@/types/api";

const STATUS_VARIANT: Record<SubstationStatus, "success" | "warning" | "secondary"> = {
  ACTIVE: "success",
  MAINTENANCE: "warning",
  DECOMMISSIONED: "secondary",
};

function SubstationsContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading } = useSubstations();
  const deleteMutation = useDeleteSubstation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Substation | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Substations</h2>
          <p className="text-sm text-muted-foreground">Grid substations and their capacity.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New substation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New substation</DialogTitle>
            </DialogHeader>
            <SubstationForm onDone={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.substations.map((substation) => (
              <TableRow key={substation.id}>
                <TableCell>{substation.name}</TableCell>
                <TableCell className="font-data text-xs">{substation.code}</TableCell>
                <TableCell className="text-muted-foreground">{substation.location}</TableCell>
                <TableCell className="font-data">{substation.capacityMW} MW</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[substation.status]}>{substation.status}</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(substation)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Delete ${substation.name}? This can't be undone.`)) {
                          deleteMutation.mutate(substation.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {data?.substations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No substations yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit substation</DialogTitle>
          </DialogHeader>
          {editing && <SubstationForm substation={editing} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SubstationsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <SubstationsContent />
    </RoleGuard>
  );
}
