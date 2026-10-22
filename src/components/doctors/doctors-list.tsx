"use client";

import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/initials";
import { formatAbsoluteDate, formatNumber } from "@/lib/format";
import { DoctorActionsMenu } from "./doctor-actions-menu";
import type { DoctorWithPatientCount } from "@/types";

const CLICKABLE_CLASS =
  "cursor-pointer transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none";

/** Keyboard support shared by the clickable row and the mobile card. */
function activateOnEnterSpace(
  event: React.KeyboardEvent,
  doctorId: string,
  onOpen: (doctorId: string) => void
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onOpen(doctorId);
}

type DoctorRowProps = {
  doctor: DoctorWithPatientCount;
  onOpen: (doctorId: string) => void;
  onEdit: (doctor: DoctorWithPatientCount) => void;
  onDelete: (doctor: DoctorWithPatientCount) => void;
};

export const DoctorRow = memo(function DoctorRow({
  doctor,
  onOpen,
  onEdit,
  onDelete,
}: DoctorRowProps) {
  return (
    <TableRow
      className={CLICKABLE_CLASS}
      tabIndex={0}
      aria-label={`Open details of ${doctor.name}`}
      onClick={() => onOpen(doctor._id)}
      onKeyDown={(event) => activateOnEnterSpace(event, doctor._id, onOpen)}
    >
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-[0.7rem] font-medium text-primary">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="block truncate font-medium">{doctor.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {doctor.email}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{doctor.specialization}</Badge>
      </TableCell>
      <TableCell className="max-w-40 truncate">{doctor.hospital}</TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {doctor.phone}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatNumber(doctor.patientCount)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatAbsoluteDate(doctor.createdAt)}
      </TableCell>
      <TableCell className="w-12">
        <div
          onClick={(event) => event.stopPropagation()}
          className="flex justify-end"
        >
          <DoctorActionsMenu doctor={doctor} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
});

type DoctorsTableProps = {
  doctors: DoctorWithPatientCount[];
  onOpen: (doctorId: string) => void;
  onEdit: (doctor: DoctorWithPatientCount) => void;
  onDelete: (doctor: DoctorWithPatientCount) => void;
};

/** Table shown from `md` upwards (hidden on small screens). */
export function DoctorsTable({
  doctors,
  onOpen,
  onEdit,
  onDelete,
}: DoctorsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Patients</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <DoctorRow
              key={doctor._id}
              doctor={doctor}
              onOpen={onOpen}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type DoctorListCardProps = {
  doctor: DoctorWithPatientCount;
  onOpen: (doctorId: string) => void;
  onEdit: (doctor: DoctorWithPatientCount) => void;
  onDelete: (doctor: DoctorWithPatientCount) => void;
};

/** Card shown below `md` (hidden on larger screens). */
export const DoctorListCard = memo(function DoctorListCard({
  doctor,
  onOpen,
  onEdit,
  onDelete,
}: DoctorListCardProps) {
  return (
    <div
      className={CLICKABLE_CLASS + " rounded-xl border bg-card p-4"}
      role="button"
      tabIndex={0}
      aria-label={`Open details of ${doctor.name}`}
      onClick={() => onOpen(doctor._id)}
      onKeyDown={(event) => activateOnEnterSpace(event, doctor._id, onOpen)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="block truncate font-medium">{doctor.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {doctor.email}
            </span>
          </div>
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <DoctorActionsMenu doctor={doctor} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Specialization</dt>
          <dd className="mt-1">
            <Badge variant="outline">{doctor.specialization}</Badge>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Hospital</dt>
          <dd className="mt-1 truncate">{doctor.hospital}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Phone</dt>
          <dd className="mt-1">{doctor.phone}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Patients</dt>
          <dd className="mt-1 tabular-nums">{formatNumber(doctor.patientCount)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Added</dt>
          <dd className="mt-1 whitespace-nowrap text-muted-foreground">
            {formatAbsoluteDate(doctor.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
});

type DoctorsCardListProps = {
  doctors: DoctorWithPatientCount[];
  onOpen: (doctorId: string) => void;
  onEdit: (doctor: DoctorWithPatientCount) => void;
  onDelete: (doctor: DoctorWithPatientCount) => void;
};

/** Stacked cards shown below `md`. */
export function DoctorsCardList({
  doctors,
  onOpen,
  onEdit,
  onDelete,
}: DoctorsCardListProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {doctors.map((doctor) => (
        <DoctorListCard
          key={doctor._id}
          doctor={doctor}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
