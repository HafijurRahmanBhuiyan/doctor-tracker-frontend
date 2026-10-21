"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardGrid, dashboardGridClasses } from "./dashboard-layout";

function StatCardSkeleton() {
  return (
    <Card className="min-w-0">
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton({ height = "h-[220px]" }: { height?: string }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${height}`} />
      </CardContent>
    </Card>
  );
}

/** Fallback for a chart that is still being code-split / rendered. */
export function ChartSkeleton({ className = "h-[220px]" }: { className?: string }) {
  return <Skeleton className={`w-full ${className}`} />;
}

/** Mirrors the real dashboard layout so nothing jumps once the data arrives. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className={dashboardGrid}>
        <div className={dashboardGridClasses.area}>
          <ChartCardSkeleton height="h-[260px]" />
        </div>
        <div className={dashboardGridClasses.donut}>
          <ChartCardSkeleton height="h-[340px]" />
        </div>
        <div className={dashboardGridClasses.perDoctor}>
          <ChartCardSkeleton height="h-[300px]" />
        </div>
        <div className={dashboardGridClasses.recentPatients}>
          <ChartCardSkeleton height="h-[300px]" />
        </div>
        <div className={dashboardGridClasses.doctorsOverTime}>
          <ChartCardSkeleton height="h-[220px]" />
        </div>
        <div className={dashboardGridClasses.gender}>
          <ChartCardSkeleton height="h-[180px]" />
        </div>
        <div className={dashboardGridClasses.specializations}>
          <ChartCardSkeleton height="h-[180px]" />
        </div>
      </div>
    </div>
  );
}
