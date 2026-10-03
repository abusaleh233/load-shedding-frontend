"use client";

import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "@/services/audit.service";

export function useAuditLogs(params?: { page?: number; limit?: number; entity?: string; action?: string }) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => listAuditLogs(params),
  });
}
