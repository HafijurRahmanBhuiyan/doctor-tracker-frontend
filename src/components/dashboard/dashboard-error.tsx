"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardErrorProps = {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function DashboardError({
  message,
  onRetry,
  isRetrying = false,
}: DashboardErrorProps) {
  return (
    <Card role="alert" className="border-destructive/30">
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-medium">
            Could not load the dashboard data
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {message}
          </p>
        </div>
        <Button onClick={onRetry} disabled={isRetrying}>
          <RefreshCw
            className={cn("size-4", isRetrying && "animate-spin")}
            aria-hidden="true"
          />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

type DashboardErrorBannerProps = {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

/** Inline banner used when stale data is still on screen but a refresh failed. */
export function DashboardErrorBanner({
  message,
  onRetry,
  isRetrying = false,
}: DashboardErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3"
    >
      <p className="flex items-center gap-2 text-sm text-destructive">
        <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
      <Button size="sm" variant="outline" onClick={onRetry} disabled={isRetrying}>
        <RefreshCw
          className={cn("size-4", isRetrying && "animate-spin")}
          aria-hidden="true"
        />
        Retry
      </Button>
    </div>
  );
}
