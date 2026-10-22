"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConditionBadge } from "@/components/common/condition-badge";
import { GenderBadge } from "@/components/common/gender-badge";
import { getInitials } from "@/lib/initials";
import { formatAbsoluteDate } from "@/lib/format";
import type { DoctorPatient } from "@/types";

type DoctorPatientRowProps = {
  patient: DoctorPatient;
  onDelete: (patient: DoctorPatient) => void;
};

export const DoctorPatientRow = memo(function DoctorPatientRow({
  patient,
  onDelete,
}: DoctorPatientRowProps) {
  return (
    <TableRow className="transition-colors hover:bg-muted/40">
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-muted text-xs font-medium">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-medium">{patient.name}</span>
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{patient.age}</TableCell>
      <TableCell>
        <GenderBadge gender={patient.gender} />
      </TableCell>
      <TableCell>
        <ConditionBadge condition={patient.condition} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {patient.phone}
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatAbsoluteDate(patient.createdAt)}
      </TableCell>
      <TableCell className="w-12 text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${patient.name}`}
          onClick={() => onDelete(patient)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

/** The desktop patient table of the doctor detail page. */
export function DoctorPatientList({
  patients,
  onDelete,
}: {
  patients: DoctorPatient[];
  onDelete: (patient: DoctorPatient) => void;
}) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <DoctorPatientRow
              key={patient._id}
              patient={patient}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type DoctorPatientCardProps = {
  patient: DoctorPatient;
  onDelete: (patient: DoctorPatient) => void;
};

/** Mobile card of one patient. */
export const DoctorPatientCard = memo(function DoctorPatientCard({
  patient,
  onDelete,
}: DoctorPatientCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-muted text-xs font-medium">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="block truncate font-medium">{patient.name}</span>
            <span className="block text-xs text-muted-foreground">
              {patient.age} years · {patient.gender}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${patient.name}`}
          onClick={() => onDelete(patient)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Condition</dt>
          <dd className="mt-1">
            <ConditionBadge condition={patient.condition} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Gender</dt>
          <dd className="mt-1">
            <GenderBadge gender={patient.gender} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Phone</dt>
          <dd className="mt-1">{patient.phone}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Added</dt>
          <dd className="mt-1 whitespace-nowrap text-muted-foreground">
            {formatAbsoluteDate(patient.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
});

/** Mobile patient cards of the doctor detail page. */
export function DoctorPatientCardList({
  patients,
  onDelete,
}: {
  patients: DoctorPatient[];
  onDelete: (patient: DoctorPatient) => void;
}) {
  return (
    <div className="grid gap-3 md:hidden">
      {patients.map((patient) => (
        <DoctorPatientCard key={patient._id} patient={patient} onDelete={onDelete} />
      ))}
    </div>
  );
}
