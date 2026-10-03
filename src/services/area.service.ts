import { apiClient, unwrapData } from "./api-client";
import type { Area, ApiSuccessResponse, PaginatedResponse } from "@/types/api";
import type { CreateAreaInput, UpdateAreaInput } from "@/lib/validators/area.schema";

export async function listAreas(params?: { page?: number; limit?: number; substationId?: string; search?: string }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Area, "areas">>>("/areas", {
    params: { limit: 100, ...params },
  });
  return unwrapData(response);
}

export async function createArea(input: CreateAreaInput): Promise<Area> {
  const response = await apiClient.post<ApiSuccessResponse<Area>>("/areas", input);
  return unwrapData(response);
}

export async function updateArea(id: string, input: UpdateAreaInput): Promise<Area> {
  const response = await apiClient.patch<ApiSuccessResponse<Area>>(`/areas/${id}`, input);
  return unwrapData(response);
}

export async function deleteArea(id: string): Promise<void> {
  await apiClient.delete(`/areas/${id}`);
}
