"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSchedule, listSchedules } from "@/services/schedule.service";
import { extractErrorMessage } from "@/services/api-client";
import type { CreateScheduleInput } from "@/lib/validators/schedule.schema";

export function useSchedules(params?: { page?: number; areaId?: string }) {
  return useQuery({
    queryKey: ["schedules", "list", params],
    queryFn: () => listSchedules(params),
  });
}

export function useCreateSchedule(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateScheduleInput) => createSchedule(input),
    onSuccess: () => {
      toast.success("Schedule created");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      onSuccess?.();
    },
    onError: (error) => {
      // Surfaces the backend's 409 overlap-conflict message verbatim —
      // that's the one error a schedule creator genuinely needs to read.
      toast.error(extractErrorMessage(error));
    },
  });
}
