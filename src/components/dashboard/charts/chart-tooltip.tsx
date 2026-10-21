"use client";

import { ReactNode } from "react";
import { type TooltipPayload } from "recharts";

/**
 * Props Recharts injects into a custom tooltip. Every field is optional so the
 * component can be rendered as `<MyTooltip />` before Recharts clones it.
 */
export type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
};

type TooltipShellProps = {
  title: ReactNode;
  children: ReactNode;
};

/** Shared tooltip surface so every chart tooltip looks the same in both themes. */
export function TooltipShell({ title, children }: TooltipShellProps) {
  return (
    <div className="min-w-32 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <p className="font-medium">{title}</p>
      <div className="mt-1 space-y-0.5 text-muted-foreground">{children}</div>
    </div>
  );
}
