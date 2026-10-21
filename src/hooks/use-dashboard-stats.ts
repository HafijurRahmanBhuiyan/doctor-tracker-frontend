"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/services/dashboard.service";
import type { DashboardDateRange, DashboardStats } from "@/types";

export const DASHBOARD_STATS_QUERY_KEY = "dashboard-stats";

/** Stable query key: the active range is part of the key. */
export function dashboardStatsQueryKey(range?: DashboardDateRange) {
  return [DASHBOARD_STATS_QUERY_KEY, range?.from ?? null, range?.to ?? null] as const;
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
