"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { useSchedules } from "@/hooks/use-schedules";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SchedulesPage() {
  const { data, isLoading } = useSchedules();

  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Schedules</h2>
            <p className="text-sm text-muted-foreground">Planned load-shedding windows across all areas.</p>
          </div>
          <Button asChild>
            <Link href="/operator/schedules/new">
              <Plus className="h-4 w-4" />
              New schedule
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.area?.name ?? "—"}</TableCell>
                  <TableCell className="font-data">{format(new Date(schedule.startTime), "PP p")}</TableCell>
                  <TableCell className="font-data">{format(new Date(schedule.endTime), "PP p")}</TableCell>
                  <TableCell className="max-w-xs truncate">{schedule.reason}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{schedule.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data?.schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No schedules yet.
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
