import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, PaginatedResponse, Substation } from "@/types/api";
import type { CreateSubstationInput, UpdateSubstationInput } from "@/lib/validators/substation.schema";

export async function listSubstations(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Substation, "substations">>>(
    "/substations",
    { params: { limit: 100, ...params } }
  );
  return unwrapData(response);
}

export async function createSubstation(input: CreateSubstationInput): Promise<Substation> {
  const response = await apiClient.post<ApiSuccessResponse<Substation>>("/substations", input);
  return unwrapData(response);
}

export async function updateSubstation(id: string, input: UpdateSubstationInput): Promise<Substation> {
  const response = await apiClient.patch<ApiSuccessResponse<Substation>>(`/substations/${id}`, input);
  return unwrapData(response);
}

export async function deleteSubstation(id: string): Promise<void> {
  await apiClient.delete(`/substations/${id}`);
}
