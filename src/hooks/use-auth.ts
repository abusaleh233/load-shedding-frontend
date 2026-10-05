"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { getAccessToken, getRefreshToken } from "@/lib/token-storage";
import { extractErrorMessage } from "@/services/api-client";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";

export const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  OPERATOR: "/operator",
  CONSUMER: "/consumer",
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isHydrated, setSession, setUser, logout, markHydrated } = useAuthStore();

 
  const { data: hydratedUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: !isHydrated && !!getAccessToken() && !user,
    retry: false,
  });

  useEffect(() => {
    if (isHydrated) return;
    if (!getAccessToken()) {
      markHydrated();
      return;
    }
    if (hydratedUser) {
      setUser(hydratedUser);
      markHydrated();
    }
  }, [hydratedUser, isHydrated, markHydrated, setUser]);

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push(ROLE_HOME[data.user.role] ?? "/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      toast.success("Account created");
      router.push(ROLE_HOME[data.user.role] ?? "/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome, ${data.user.name}`);
      router.push(ROLE_HOME[data.user.role] ?? "/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    logout();
    queryClient.clear();
    if (refreshToken) {
      // Best-effort — the user is logged out client-side regardless of
      // whether this server-side revoke call succeeds.
      authService.logout(refreshToken).catch(() => undefined);
    }
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isHydrated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    loginWithGoogle: googleLoginMutation.mutate,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    logout: handleLogout,
  };
}
