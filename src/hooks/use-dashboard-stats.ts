"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/services/dashboard.service";
import { dashboardKeys } from "@/lib/query-keys";
import type { DashboardDateRange, DashboardStats } from "@/types";

/** Stable query key: the active range is part of the key. */
export function dashboardStatsQueryKey(range?: DashboardDateRange) {
  return [
    ...dashboardKeys.stats(),
    range?.from ?? null,
    range?.to ?? null,
  ] as const;
}

export function useDashboardStats(range?: DashboardDateRange) {
  return useQuery<DashboardStats>({
    queryKey: dashboardStatsQueryKey(range),
    queryFn: () => fetchDashboardStats(range),
    // Keeps the previous payload visible while a new range is loading,
    // so the page never flashes empty between range changes.
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
