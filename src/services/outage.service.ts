import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, OutageLog, OutageLogStatus, OutageType, PaginatedResponse, PriorityLevel } from "@/types/api";

export async function getLiveOutages(): Promise<OutageLog[]> {
  const response = await apiClient.get<ApiSuccessResponse<OutageLog[]>>("/outages/live");
  return unwrapData(response);
}

export interface CreateOutageInput {
  areaId: string;
  type: OutageType;
  priority?: PriorityLevel;
  description?: string;
}

export async function reportOutage(input: CreateOutageInput): Promise<OutageLog> {
  const response = await apiClient.post<ApiSuccessResponse<OutageLog>>("/outages", input);
  return unwrapData(response);
}

export async function listOutages(params?: {
  page?: number;
  limit?: number;
  areaId?: string;
  type?: OutageType;
  status?: OutageLogStatus;
}) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<OutageLog, "outages">>>("/outages", {
    params: { limit: 50, ...params },
  });
  return unwrapData(response);
}

export interface UpdateOutageInput {
  status?: OutageLogStatus;
  priority?: PriorityLevel;
  description?: string;
}

export async function updateOutage(id: string, input: UpdateOutageInput): Promise<OutageLog> {
  const response = await apiClient.patch<ApiSuccessResponse<OutageLog>>(`/outages/${id}`, input);
  return unwrapData(response);
}

export async function deleteOutage(id: string): Promise<void> {
  await apiClient.delete(`/outages/${id}`);
}
