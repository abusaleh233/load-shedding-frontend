import { QueryClient } from "@tanstack/react-query";
import { extractErrorMessage } from "@/services/api-client";

/**
 * A single QueryClient instance shared by the whole app (created once in
 * query-provider.tsx, not per-render). Defaults are tuned for a
 * dashboard-style app where most data (outages, schedules, bills) can be a
 * few seconds stale but should never be silently retried against a
 * known-bad auth state.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // matches the backend's Redis TTL for /outages/live
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry 401s — the axios interceptor already tried a
          // refresh once; if it still failed, retrying the query just
          // repeats the same doomed request.
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 401 || status === 403) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        onError: (error) => {
          // Individual mutations can still override this per-call; this is
          // just a safety net so a forgotten onError doesn't fail silently.
          // eslint-disable-next-line no-console
          console.error(extractErrorMessage(error));
        },
      },
    },
  });
}
