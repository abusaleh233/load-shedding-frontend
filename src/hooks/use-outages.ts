"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as outageService from "@/services/outage.service";
import { extractErrorMessage } from "@/services/api-client";
import type { CreateOutageInput, UpdateOutageInput } from "@/services/outage.service";
import type { OutageLogStatus, OutageType } from "@/types/api";

export function useOutages(params?: { areaId?: string; type?: OutageType; status?: OutageLogStatus }) {
  return useQuery({
    queryKey: ["outages", "list", params],
    queryFn: () => outageService.listOutages(params),
  });
}

export function useReportOutage(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOutageInput) => outageService.reportOutage(input),
    onSuccess: () => {
      toast.success("Outage reported");
      // "live" and "list" are separate query keys/cache entries (different
      // endpoints), so both need invalidating for every view to catch up.
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateOutage(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOutageInput }) => outageService.updateOutage(id, input),
    onSuccess: () => {
      toast.success("Outage updated");
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteOutage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => outageService.deleteOutage(id),
    onSuccess: () => {
      toast.success("Outage deleted");
      queryClient.invalidateQueries({ queryKey: ["outages"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
