import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { DashboardDateRange } from "@/types";

/**
 * Converts a react-day-picker range into the YYYY-MM-DD strings the API
 * expects. Returns `undefined` when no range is selected (backend default).
 */
export function toApiRange(range: DateRange | undefined): DashboardDateRange | undefined {
  if (!range?.from) return undefined;

  const from = format(range.from, "yyyy-MM-dd");
  const to = range.to ? format(range.to, "yyyy-MM-dd") : undefined;

  return { from, to };
}

/** True when a series has no rows or only zeros. */
export function isEmptySeries(items: { count: number }[]) {
  return items.length === 0 || items.every((item) => item.count === 0);
}
