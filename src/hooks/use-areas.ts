"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as areaService from "@/services/area.service";
import { extractErrorMessage } from "@/services/api-client";
import type { CreateAreaInput, UpdateAreaInput } from "@/lib/validators/area.schema";

export function useAreas(params?: { substationId?: string; search?: string }) {
  return useQuery({
    queryKey: ["areas", "list", params],
    queryFn: () => areaService.listAreas(params),
    staleTime: 60_000,
  });
}

export function useCreateArea(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAreaInput) => areaService.createArea(input),
    onSuccess: () => {
      toast.success("Area created");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateArea(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAreaInput }) => areaService.updateArea(id, input),
    onSuccess: () => {
      toast.success("Area updated");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => areaService.deleteArea(id),
    onSuccess: () => {
      toast.success("Area deleted");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
