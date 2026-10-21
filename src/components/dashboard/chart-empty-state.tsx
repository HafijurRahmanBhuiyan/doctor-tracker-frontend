"use client";

import { ChartNoAxesColumn } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartEmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

/** Rendered inside a chart card when the chart has no (or only zero) values. */
export function ChartEmptyState({
  title = "No data for this period",
  description = "Try widening the date range or clear the filter.",
  className,
}: ChartEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 text-center",
        className
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ChartNoAxesColumn className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-[220px] text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
