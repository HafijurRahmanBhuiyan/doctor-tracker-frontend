import api from "@/lib/api";
import type { ApiResponse, DashboardDateRange, DashboardStats } from "@/types";

/**
 * Fetch the aggregated dashboard statistics.
 *
 * @param range Optional inclusive range. `from`/`to` are YYYY-MM-DD strings;
 *              when omitted the backend falls back to its own defaults.
 */
export async function fetchDashboardStats(
  range?: DashboardDateRange
): Promise<DashboardStats> {
  const params: Record<string, string> = {};

  if (range?.from) params.from = range.from;
  if (range?.to) params.to = range.to;

  const res = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats", {
    params,
  });

  return res.data.data;
}
