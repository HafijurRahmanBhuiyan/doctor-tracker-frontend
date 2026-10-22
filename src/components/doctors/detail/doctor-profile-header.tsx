"use client";

import { memo } from "react";
import {
  Briefcase,
  Building2,
  CalendarClock,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/initials";
import { formatAbsoluteDate, formatNumber } from "@/lib/format";
import type { DoctorWithPatientCount } from "@/types";

export type DoctorProfileHeaderProps = {
  doctor: DoctorWithPatientCount;
  onEdit: () => void;
  onDelete: () => void;
};

/** The profile card at the top of the doctor detail page. */
export const DoctorProfileHeader = memo(function DoctorProfileHeader({
  doctor,
  onEdit,
  onDelete,
}: DoctorProfileHeaderProps) {
  const patientsLabel = `${formatNumber(doctor.patientCount)} ${
    doctor.patientCount === 1 ? "patient" : "patients"
  }`;

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
            {getInitials(doctor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {doctor.name}
            </h1>
            <Badge variant="secondary" className="gap-1.5">
              <Briefcase className="size-3" aria-hidden="true" />
              {doctor.specialization}
            </Badge>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{doctor.hospital}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              {doctor.phone}
            </a>
            <a
              href={`mailto:${doctor.email}`}
              className="flex min-w-0 items-center gap-1.5 truncate transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{doctor.email}</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              {patientsLabel}
            </span>
            <Separator
              orientation="vertical"
              className="hidden h-4 sm:block"
              aria-hidden="true"
            />
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4" aria-hidden="true" />
              Added {formatAbsoluteDate(doctor.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
