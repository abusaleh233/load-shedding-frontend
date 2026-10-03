"use client";

import { format } from "date-fns";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AuditLogTable() {
  const { data, isLoading, isError } = useAuditLogs({ limit: 50 });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  if (isError) {
    return <p className="text-sm text-destructive">Couldn&apos;t load audit logs. Try refreshing.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Entity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-data whitespace-nowrap text-xs">
              {format(new Date(log.createdAt), "PP p")}
            </TableCell>
            <TableCell>
              {log.user ? (
                <div className="flex flex-col">
                  <span className="text-sm">{log.user.name}</span>
                  <span className="text-xs text-muted-foreground">{log.user.email}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">System</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-data">
                {log.action}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {log.entity}
              {log.entityId && <span className="font-data text-xs"> · {log.entityId.slice(0, 8)}</span>}
            </TableCell>
          </TableRow>
        ))}
        {data?.logs.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No audit activity yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
