"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Plus, SearchX, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { CustomPagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { SearchInput } from "@/components/common/search-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorStatus, getErrorMessage } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import {
  useDoctor,
  useDoctorPatients,
  useRemoveDoctorPatient,
} from "@/hooks/use-doctors";
import { useUrlState } from "@/hooks/use-url-state";
import { DoctorDetailSkeleton } from "@/components/doctors/doctors-skeleton";
import { DoctorNotFound } from "./doctor-not-found";
import { DoctorProfileHeader } from "./doctor-profile-header";
import {
  DoctorPatientCardList,
  DoctorPatientList,
} from "./doctor-patient-list";
import type { DoctorPatient } from "@/types";

const AddPatientDialog = dynamic(
  () => import("@/components/patients/add-patient-dialog").then((module) => module.AddPatientDialog)
);
const DoctorFormDialog = dynamic(
  () => import("@/components/doctors/doctor-form-dialog").then((module) => module.DoctorFormDialog)
);
const DoctorDeleteDialog = dynamic(
  () => import("@/components/doctors/doctor-delete-dialog").then((module) => module.DoctorDeleteDialog)
);

/**
 * URL params of the patients section. The names do not clash with any other
 * section (`pq` patient query, `pp` patient page, `pl` patient limit).
 */
type DoctorPatientsUrlState = {
  pq: string;
  pp: number;
  pl: number;
};

const DEFAULT_PATIENTS_URL_STATE: DoctorPatientsUrlState = {
  pq: "",
  pp: 1,
  pl: 10,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function DoctorDetailView({ doctorId }: { doctorId: string }) {
  const router = useRouter();

  const doctorQuery = useDoctor(doctorId);
  const doctor = doctorQuery.data;

  const { values, setParams } = useUrlState<DoctorPatientsUrlState>(
    DEFAULT_PATIENTS_URL_STATE
  );

  const patientsQuery = useDoctorPatients(
    doctorId,
    useMemo(
      () => ({
        page: values.pp,
        limit: values.pl,
        search: values.pq || undefined,
      }),
      [values.pp, values.pl, values.pq]
    )
  );

  /* ---------------------------------------------------------------- */
  /* Dialog state                                                      */
  /* ---------------------------------------------------------------- */

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [removingPatient, setRemovingPatient] = useState<DoctorPatient | null>(
    null
  );

  const removePatientMutation = useRemoveDoctorPatient(doctorId);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */

  const handlePatientSearchChange = useCallback(
    (query: string) => {
      setParams({ pq: query }, { reset: ["pp"] });
    },
    [setParams]
  );

  const handlePatientPageChange = useCallback(
    (page: number) => {
      setParams({ pp: page });
    },
    [setParams]
  );

  const handlePatientPageSizeChange = useCallback(
    (limit: number) => {
      setParams({ pl: limit, pp: 1 });
    },
    [setParams]
  );

  const handleDeletePatient = useCallback((patient: DoctorPatient) => {
    setRemovingPatient(patient);
  }, []);

  const handleRemovePatient = useCallback(async () => {
    if (!removingPatient) return;

    try {
      await removePatientMutation.mutateAsync({
        patientId: removingPatient._id,
      });
      setRemovingPatient(null);
    } catch {
      // The mutation hook already rolled back and showed the error toast.
    }
  }, [removingPatient, removePatientMutation]);

  const goBack = useCallback(() => {
    router.push("/doctors");
  }, [router]);

  const doctorError = doctorQuery.isError
    ? getErrorMessage(doctorQuery.error)
    : null;

  const patients = useMemo(
    () => patientsQuery.data?.data ?? [],
    [patientsQuery.data]
  );
  const patientsMeta = patientsQuery.data?.meta;
  const patientsFetchMore =
    patientsQuery.isFetching && !patientsQuery.isPending;
  const patientsFirstLoad = patientsQuery.isPending && !patientsQuery.isError;

  /* ---------------------------------------------------------------- */
  /* Load states                                                       */
  /* ---------------------------------------------------------------- */

  if (doctorQuery.isPending) {
    return <DoctorDetailSkeleton />;
  }

  if (doctorQuery.isError) {
    if (getErrorStatus(doctorQuery.error) === 404) {
      return <DoctorNotFound />;
    }

    return (
      <ErrorState
        title="Could not load the doctor"
        detail={doctorError ?? "An unexpected error occurred"}
        onRetry={() => doctorQuery.refetch()}
        isRetrying={doctorQuery.isFetching}
      />
    );
  }

  if (!doctor) return null;

  /* ---------------------------------------------------------------- */
  /* View                                                              */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Back to doctors"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumbs
          items={[
            { label: "Doctors", href: "/doctors" },
            { label: doctor.name },
          ]}
        />
      </div>

      <DoctorProfileHeader
        doctor={doctor}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Patients
            <Badge variant="secondary">{formatNumber(doctor.patientCount)}</Badge>
          </CardTitle>
          <CardDescription>
            Everyone assigned to {doctor.name}. They are removed with the doctor
            as well.
          </CardDescription>
          <Button variant="outline" size="sm" asChild className="mt-3">
            <Link href={`/patients?doctor=${doctorId}`}>
              View all patients
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={values.pq}
              onChange={handlePatientSearchChange}
              placeholder="Search by name, email, phone or condition"
              className="w-full sm:w-64"
            />
            <Button onClick={() => setAddPatientOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>

          {patientsFirstLoad ? (
            <TableSkeleton
              rows={Math.min(values.pl, 5)}
              columns={6}
            />
          ) : patientsQuery.isError ? (
            <ErrorState
              title="Could not load the patients"
              detail={getErrorMessage(patientsQuery.error)}
              onRetry={() => patientsQuery.refetch()}
              isRetrying={patientsQuery.isFetching}
            />
          ) : patientsMeta?.total === 0 ? (
            values.pq ? (
              <EmptyState
                icon={SearchX}
                title="No patients match the search"
                description="Try a different name or condition."
              />
            ) : (
              <EmptyState
                icon={Users}
                title="No patients yet"
                description="Add the first patient of this doctor to see them here."
                action={{
                  label: "Add Patient",
                  onClick: () => setAddPatientOpen(true),
                }}
              />
            )
          ) : (
            <div
              className={cn(
                "relative space-y-4 transition-opacity duration-200",
                patientsFetchMore && "pointer-events-none opacity-60"
              )}
              aria-busy={patientsFetchMore}
            >
              {patientsFetchMore ? (
                <Loader2
                  aria-label="Loading patients"
                  className="absolute right-0 top-0 h-4 w-4 animate-spin text-muted-foreground"
                />
              ) : null}

              <DoctorPatientList
                patients={patients}
                onDelete={handleDeletePatient}
              />
              <DoctorPatientCardList
                patients={patients}
                onDelete={handleDeletePatient}
              />

              <CustomPagination
                currentPage={patientsMeta?.page ?? values.pp}
                totalPages={patientsMeta?.totalPages ?? 1}
                totalItems={patientsMeta?.total ?? 0}
                pageSize={patientsMeta?.limit ?? values.pl}
                onPageChange={handlePatientPageChange}
                onPageSizeChange={handlePatientPageSizeChange}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DoctorFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        doctor={doctor}
      />

      <DoctorDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        doctor={doctor}
        onDeleted={goBack}
      />

      <AddPatientDialog
        doctorId={doctorId}
        open={addPatientOpen}
        onOpenChange={setAddPatientOpen}
      />

      <ConfirmDialog
        open={Boolean(removingPatient)}
        onOpenChange={(open) => {
          if (!open && !removePatientMutation.isPending) setRemovingPatient(null);
        }}
        title="Remove patient"
        description={`${removingPatient?.name ?? "This patient"} will be permanently removed from the patient list of ${doctor.name}. This action cannot be undone.`}
        confirmText="Remove patient"
        destructive
        loading={removePatientMutation.isPending}
        onConfirm={handleRemovePatient}
      />
    </div>
  );
}
