"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, User, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import type { LoginInput } from "@/lib/validators/auth.schema";
import type { Role } from "@/types/api";


const DEMO_ACCOUNTS: Array<{ role: Role; label: string; icon: typeof ShieldCheck; credentials: LoginInput }> = [
  {
    role: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    credentials: { email: "admin123@gmail.com", password: "Admin123!" },
  },
  {
    role: "OPERATOR",
    label: "Operator",
    icon: Wrench,
    credentials: { email: "operator123@gmail.com", password: "Operator123!" },
  },
  {
    role: "CONSUMER",
    label: "Consumer",
    icon: User,
    credentials: { email: "consumer123@gmail.com", password: "Consumer123!" },
  },
];

/**
 * One-click login for each role, for demoing the app without typing
 * credentials. Deliberately does NOT call authService or apiClient
 * directly — it reuses useAuth()'s existing `login` mutation, the exact
 * same call the real login form makes, so token storage, the routing
 * cookies, auth-store state, the role-based redirect, and error toasts all
 * go through the one code path that's already tested by normal sign-in.
 * The only thing added here is a per-button loading state, since the
 * hook's shared `isLoggingIn` flag would otherwise light up all three
 * buttons at once instead of just the one that was clicked.
 */
export function DemoLogin() {
  const { login } = useAuth();
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);

  const handleDemoLogin = (role: Role, credentials: LoginInput) => {
    if (loadingRole) return; // already logging in — ignore extra clicks
    setLoadingRole(role);
    login(credentials, {
      onSettled: () => setLoadingRole(null),
    });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">One-click demo login</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map(({ role, label, icon: Icon, credentials }) => {
          const isThisLoading = loadingRole === role;
          return (
            <Button
              key={role}
              type="button"
              variant="outline"
              size="sm"
              disabled={!!loadingRole}
              onClick={() => handleDemoLogin(role, credentials)}
              className="flex-col gap-1.5 py-3 h-auto"
            >
              {isThisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              <span className="text-xs">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
