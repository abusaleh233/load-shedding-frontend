"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}


export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [allowedRoles, isAuthenticated, isHydrated, router, user]);

  if (!isHydrated || !isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
