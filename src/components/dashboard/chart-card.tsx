"use client";

import { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChartCardProps = {
  title: string;
  description?: string;
  /** Accessible name of the card (charts are visual, so they are labelled here). */
  ariaLabel: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function ChartCard({
  title,
  description,
  ariaLabel,
  action,
  children,
  className,
  bodyClassName,
}: ChartCardProps) {
  return (
    <Card
      role="group"
      aria-label={ariaLabel}
      className={cn("min-w-0 overflow-hidden", className)}
    >
      <CardHeader>
        <div className="min-w-0 space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn("min-w-0", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}
