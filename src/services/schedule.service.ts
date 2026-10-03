import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, PaginatedResponse, Schedule } from "@/types/api";
import type { CreateScheduleInput } from "@/lib/validators/schedule.schema";

export async function listSchedules(params?: { page?: number; limit?: number; areaId?: string }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Schedule, "schedules">>>(
    "/schedules",
    { params }
  );
  return unwrapData(response);
}

export async function createSchedule(input: CreateScheduleInput): Promise<Schedule> {
  const response = await apiClient.post<ApiSuccessResponse<Schedule>>("/schedules", {
    ...input,
    startTime: new Date(input.startTime).toISOString(),
    endTime: new Date(input.endTime).toISOString(),
  });
  return unwrapData(response);
}
