"use client";

import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { DateRangePicker } from "@/components/common/date-range-picker";

type DashboardHeaderProps = {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  isFetching?: boolean;
};

export function DashboardHeader({
  range,
  onRangeChange,
  isFetching = false,
}: DashboardHeaderProps) {
  return (
    <PageHeader
      title="Dashboard"
      description="Live overview of doctors, patients and practice trends."
      actions={
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="flex items-center gap-2">
            <DateRangePicker
              value={range}
              onChange={onRangeChange}
              placeholder="Last 30 days"
            />
            {isFetching ? (
              <Loader2
                className="size-4 animate-spin text-muted-foreground"
                aria-label="Updating dashboard"
              />
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Totals are all-time</p>
        </div>
      }
    />
  );
}
