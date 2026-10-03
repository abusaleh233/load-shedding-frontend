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

/**
 * Client-side defense-in-depth on top of src/middleware.ts. Middleware
 * already blocks the wrong role from ever loading a /admin, /operator, or
 * /consumer route at the edge — this component exists for two things
 * middleware can't do:
 *   1. Show a real loading state instead of a flash of the wrong content
 *      while the auth store is still hydrating from localStorage.
 *   2. Gate something finer-grained than a whole route prefix (e.g. an
 *      ADMIN-only section inside an otherwise-shared page), where
 *      middleware's path-based matcher isn't precise enough.
 *
 * Either way, this is still a UX layer, not the security boundary — every
 * data-fetching call underneath still goes through the backend's own
 * authenticate + authorize middleware with the real JWT.
 */
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
