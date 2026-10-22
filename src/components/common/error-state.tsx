"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  /** Shown as the headline; describes what could not be loaded. */
  title?: string;
  detail: string;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
};

/** Inline error state with a retry button. */
export function ErrorState({
  title = "Something went wrong",
  detail,
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <Card role="alert" className={cn("border-destructive/30", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-medium">{title}</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {detail}
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
