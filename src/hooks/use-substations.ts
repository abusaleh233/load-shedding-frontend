"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as substationService from "@/services/substation.service";
import { extractErrorMessage } from "@/services/api-client";
import type { CreateSubstationInput, UpdateSubstationInput } from "@/lib/validators/substation.schema";

export function useSubstations(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["substations", "list", params],
    queryFn: () => substationService.listSubstations(params),
  });
}

export function useCreateSubstation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubstationInput) => substationService.createSubstation(input),
    onSuccess: () => {
      toast.success("Substation created");
      queryClient.invalidateQueries({ queryKey: ["substations"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateSubstation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSubstationInput }) =>
      substationService.updateSubstation(id, input),
    onSuccess: () => {
      toast.success("Substation updated");
      queryClient.invalidateQueries({ queryKey: ["substations"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteSubstation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => substationService.deleteSubstation(id),
    onSuccess: () => {
      toast.success("Substation deleted");
      queryClient.invalidateQueries({ queryKey: ["substations"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
