"use client";

import { memo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatAbsoluteDate } from "@/lib/format";
import type { DashboardRecentPatient } from "@/types";
import { ChartCard } from "./chart-card";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type RecentPatientsCardProps = {
  patients: DashboardRecentPatient[];
};

export const RecentPatientsCard = memo(function RecentPatientsCard({
  patients,
}: RecentPatientsCardProps) {
  // A relative date depends on "now", so it can only be rendered in the
  // browser. Until the tree is hydrated a deterministic (UTC) date is used
  // instead, which keeps the server render and the first client render equal.
  const hydrated = useHydrated();

  return (
    <ChartCard
      title="Recent patients"
      description="The five most recently registered patients."
      ariaLabel="Recent patients list"
      action={
        <Button variant="ghost" size="sm" asChild>
          <Link href="/patients">
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      }
    >
      {patients.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No patients have been added yet.
        </p>
      ) : (
        <ul className="divide-y">
          {patients.map((patient) => (
            <li
              key={patient.patientId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/patients?search=${encodeURIComponent(patient.name)}`}
                  className="block truncate rounded-sm text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {patient.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {patient.doctorName ?? "Unassigned"}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant="secondary" className="max-w-[140px] truncate">
                  {patient.condition}
                </Badge>
                <time
                  dateTime={patient.createdAt}
                  className="text-xs text-muted-foreground"
                >
                  {hydrated
                    ? formatDistanceToNow(new Date(patient.createdAt), {
                        addSuffix: true,
                      })
                    : formatAbsoluteDate(patient.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
});
