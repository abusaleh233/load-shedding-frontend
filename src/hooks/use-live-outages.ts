"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiveOutages } from "@/services/outage.service";

/**
 * Polls at the same 30s cadence as the backend's Redis TTL for this
 * endpoint (see load-shedding-api's REDIS_TTL_SECONDS) — polling faster
 * would just re-request the same cached snapshot.
 */
export function useLiveOutages() {
  return useQuery({
    queryKey: ["outages", "live"],
    queryFn: getLiveOutages,
    refetchInterval: 30_000,
  });
}
