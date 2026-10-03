"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUser, listUsers, updateUserRole } from "@/services/user.service";
import { extractErrorMessage } from "@/services/api-client";
import type { Role } from "@/types/api";

export function useUsers(params?: { page?: number; role?: string }) {
  return useQuery({ queryKey: ["users", "list", params], queryFn: () => listUsers(params) });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) => updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
