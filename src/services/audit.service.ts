import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, AuditLog, PaginatedResponse } from "@/types/api";

export async function listAuditLogs(params?: { page?: number; limit?: number; entity?: string; action?: string }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<AuditLog, "logs">>>(
    "/admin/audit-logs",
    { params }
  );
  return unwrapData(response);
}
