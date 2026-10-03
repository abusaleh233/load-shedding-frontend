"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe } from "@/services/auth.service";
import { updateMyProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { extractErrorMessage } from "@/services/api-client";
import type { UpdateProfileInput } from "@/services/user.service";

export function useProfile() {
  return useQuery({ queryKey: ["auth", "me"], queryFn: getMe });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile(input),
    onSuccess: (user) => {
      // Keep the Zustand store (used for the Topbar name/role, sidebar
      // gating, etc.) in sync immediately — don't wait for a refetch.
      setUser(user);
      queryClient.setQueryData(["auth", "me"], user);
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
