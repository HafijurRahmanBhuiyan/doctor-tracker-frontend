"use client";

import { memo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { PatientActionsMenu } from "./patient-actions-menu";
import type { PatientWithDoctor } from "@/types";

type PatientRowProps = {
  patient: PatientWithDoctor;
  onEdit: (patient: PatientWithDoctor) => void;
  onDelete: (patient: PatientWithDoctor) => void;
};

/** One row of the patients table. */
export const PatientRow = memo(function PatientRow({
  patient,
  onEdit,
  onDelete,
}: PatientRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-[0.7rem] font-medium text-primary">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="block truncate font-medium">{patient.name}</span>
            {patient.email ? (
              <span className="block truncate text-xs text-muted-foreground">
                {patient.email}
              </span>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{patient.age}</TableCell>
      <TableCell>
        <GenderBadge gender={patient.gender} />
      </TableCell>
      <TableCell>
        <ConditionBadge condition={patient.condition} />
      </TableCell>
      <TableCell>
        <Link
          href={`/doctors/${patient.doctor._id}`}
          className="block min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="block truncate font-medium hover:underline">
            {patient.doctor.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {patient.doctor.specialization}
          </span>
        </Link>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {patient.phone}
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatAbsoluteDate(patient.createdAt)}
      </TableCell>
      <TableCell className="w-12">
        <div className="flex justify-end">
          <PatientActionsMenu
            patient={patient}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
});

type PatientsTableProps = {
  patients: PatientWithDoctor[];
  onEdit: (patient: PatientWithDoctor) => void;
  onDelete: (patient: PatientWithDoctor) => void;
};

/** Table shown from `md` upwards (hidden on small screens). */
export function PatientsTable({
  patients,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <PatientRow
              key={patient._id}
              patient={patient}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type PatientListCardProps = {
  patient: PatientWithDoctor;
  onEdit: (patient: PatientWithDoctor) => void;
  onDelete: (patient: PatientWithDoctor) => void;
};

/** Card shown below `md` (hidden on larger screens). */
export const PatientListCard = memo(function PatientListCard({
  patient,
  onEdit,
  onDelete,
}: PatientListCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="block truncate font-medium">{patient.name}</span>
            {patient.email ? (
              <span className="block truncate text-xs text-muted-foreground">
                {patient.email}
              </span>
            ) : null}
          </div>
        </div>
        <PatientActionsMenu
          patient={patient}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Age</dt>
          <dd className="mt-1 tabular-nums">{patient.age}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Gender</dt>
          <dd className="mt-1">
            <GenderBadge gender={patient.gender} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Condition</dt>
          <dd className="mt-1">
            <ConditionBadge condition={patient.condition} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Doctor</dt>
          <dd className="mt-1 min-w-0">
            <Link
              href={`/doctors/${patient.doctor._id}`}
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block truncate font-medium hover:underline">
                {patient.doctor.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {patient.doctor.specialization}
              </span>
            </Link>
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

type PatientsCardListProps = {
  patients: PatientWithDoctor[];
  onEdit: (patient: PatientWithDoctor) => void;
  onDelete: (patient: PatientWithDoctor) => void;
};

/** Stacked cards shown below `md`. */
export function PatientsCardList({
  patients,
  onEdit,
  onDelete,
}: PatientsCardListProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {patients.map((patient) => (
        <PatientListCard
          key={patient._id}
          patient={patient}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
