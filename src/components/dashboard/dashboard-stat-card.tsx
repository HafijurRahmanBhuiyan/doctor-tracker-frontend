"use client";

import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export type StatTone = "chart-1" | "chart-2" | "chart-3" | "chart-4";

const toneClasses: Record<StatTone, string> = {
  "chart-1": "bg-chart-1/10 text-chart-1",
  "chart-2": "bg-chart-2/10 text-chart-2",
  "chart-3": "bg-chart-3/10 text-chart-3",
  "chart-4": "bg-chart-4/10 text-chart-4",
};

type DashboardStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
  tone: StatTone;
  className?: string;
};

export const DashboardStatCard = memo(function DashboardStatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  className,
}: DashboardStatCardProps) {
  const animatedValue = useCountUp(value);

  return (
    <Card
      className={cn(
        "min-w-0 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            toneClasses[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {formatNumber(animatedValue)}
          </p>
          {hint ? (
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
});
