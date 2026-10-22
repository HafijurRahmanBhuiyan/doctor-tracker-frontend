"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Plus, SearchX, UserRound } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { CustomPagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api";
import { formatDateParam, parseDateParam } from "@/lib/date-range";
import { isObjectId } from "@/lib/validations/shared";
import { usePatientFilterOptions, usePatients } from "@/hooks/use-patients";
import { useUrlState } from "@/hooks/use-url-state";
import { PatientsToolbar } from "./patients-toolbar";
import { PatientsCardList, PatientsTable } from "./patients-list";
import type {
  Gender,
  PatientListParams,
  PatientSort,
  PatientSortBy,
  PatientWithDoctor,
} from "@/types";

const PatientFormDialog = dynamic(
  () => import("./patient-form-dialog").then((module) => module.PatientFormDialog)
);
const PatientDeleteDialog = dynamic(
  () => import("./patient-delete-dialog").then((module) => module.PatientDeleteDialog)
);

type PatientsUrlState = {
  search: string;
  condition: string;
  /** The id of the doctor the list is filtered by. */
  doctor: string;
  gender: string;
  /** YYYY-MM-DD */
  from: string;
  /** YYYY-MM-DD */
  to: string;
  sort: PatientSort;
  page: number;
  limit: number;
};

/** Defaults for every patient list param; the URL overrides them. */
const DEFAULT_PATIENTS_URL_STATE: PatientsUrlState = {
  search: "",
  condition: "",
  doctor: "",
  gender: "",
  from: "",
  to: "",
  sort: "newest",
  page: 1,
  limit: 10,
};

/** Only the sortings the backend accepts (`sortBy` + `order`). */
const SORT_CONFIG: Record<
  PatientSort,
  { sortBy: PatientSortBy; order: "asc" | "desc" }
> = {
  newest: { sortBy: "createdAt", order: "desc" },
  oldest: { sortBy: "createdAt", order: "asc" },
  "name-asc": { sortBy: "name", order: "asc" },
  "name-desc": { sortBy: "name", order: "desc" },
  "age-asc": { sortBy: "age", order: "asc" },
  "age-desc": { sortBy: "age", order: "desc" },
  condition: { sortBy: "condition", order: "asc" },
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const GENDERS: Gender[] = ["male", "female", "other"];

/** Only the genders the backend accepts are sent to the API. */
function toGender(value: string): Gender | undefined {
  return GENDERS.includes(value as Gender) ? (value as Gender) : undefined;
}

/** Only the offered page sizes are sent to the API. */
function toPageSize(value: number): number {
  return PAGE_SIZE_OPTIONS.includes(value) ? value : PAGE_SIZE_OPTIONS[0];
}

/**
 * The patients page. Every bit of state (search, filters, dates, sort, page
 * and page size) lives in the URL, so a link (e.g. `/patients?doctor=<id>`)
 * restores exactly the same view.
 */
export function PatientsView() {
  const { values, setParams, resetParams } = useUrlState<PatientsUrlState>(
    DEFAULT_PATIENTS_URL_STATE
  );

  const optionsQuery = usePatientFilterOptions();

  const patientsQuery = usePatients(
    useMemo<PatientListParams>(() => {
      const sort = SORT_CONFIG[values.sort] ?? SORT_CONFIG.newest;

      return {
        page: Math.max(1, values.page),
        limit: toPageSize(values.limit),
        search: values.search || undefined,
        condition: values.condition || undefined,
        // An id that is not an ObjectId is not sent to the backend, because
        // it would answer with a 400 ("Invalid ObjectId").
        doctor: isObjectId(values.doctor) ? values.doctor : undefined,
        gender: toGender(values.gender),
        from: values.from || undefined,
        to: values.to || undefined,
        sortBy: sort.sortBy,
        order: sort.order,
      };
      // `values` fields are stable, so the query params only change when
      // the URL actually changes.
    }, [
      values.search,
      values.condition,
      values.doctor,
      values.gender,
      values.from,
      values.to,
      values.sort,
      values.page,
      values.limit,
    ])
  );

  const hasActiveFilters = Boolean(
    values.search ||
      values.condition ||
      values.doctor ||
      values.gender ||
      values.from ||
      values.to
  );

  const patients = useMemo(
    () => patientsQuery.data?.data ?? [],
    [patientsQuery.data]
  );
  const meta = patientsQuery.data?.meta;
  const totalItems = meta?.total ?? 0;

  const firstLoad = patientsQuery.isPending;
  const fetchMore = patientsQuery.isFetching && !patientsQuery.isPending;

  // A page that no longer exists (e.g. the filters changed) is corrected to
  // the last available page.
  const totalPages = meta?.totalPages ?? 1;
  useEffect(() => {
    if (!patientsQuery.data) return;
    if (patientsQuery.data.meta.total === 0) return;
    if (totalPages > 0 && values.page > totalPages) {
      setParams({ page: totalPages });
    }
  }, [patientsQuery.data, setParams, totalPages, values.page]);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */

  const handleSearchChange = useCallback(
    (search: string) => {
      setParams({ search }, { reset: ["page"] });
    },
    [setParams]
  );

  const handleConditionChange = useCallback(
    (condition: string) => {
      setParams({ condition }, { reset: ["page"] });
    },
    [setParams]
  );

  const handleDoctorChange = useCallback(
    (doctor: string) => {
      setParams({ doctor }, { reset: ["page"] });
    },
    [setParams]
  );

  const handleGenderChange = useCallback(
    (gender: string) => {
      setParams({ gender }, { reset: ["page"] });
    },
    [setParams]
  );

  const dateRange = useMemo<DateRange | undefined>(() => {
    const from = parseDateParam(values.from);
    const to = parseDateParam(values.to);
    if (!from && !to) return undefined;
    return { from, to };
  }, [values.from, values.to]);

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      // Date-only values are stored so the calendar shows the day the user
      // picked, whatever the time zone is.
      setParams(
        {
          from: range?.from ? formatDateParam(range.from) : "",
          to: range?.to ? formatDateParam(range.to) : "",
        },
        { reset: ["page"] }
      );
    },
    [setParams]
  );

  const handleSortChange = useCallback(
    (sort: PatientSort) => {
      setParams({ sort }, { reset: ["page"] });
    },
    [setParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setParams({ page });
    },
    [setParams]
  );

  const handlePageSizeChange = useCallback(
    (limit: number) => {
      setParams({ limit, page: 1 });
    },
    [setParams]
  );

  const clearFilters = useCallback(() => {
    resetParams([
      "search",
      "condition",
      "doctor",
      "gender",
      "from",
      "to",
      "page",
    ]);
  }, [resetParams]);

  /* ---------------------------------------------------------------- */
  /* Dialog state                                                      */
  /* ---------------------------------------------------------------- */

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] =
    useState<PatientWithDoctor | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingPatient, setDeletingPatient] =
    useState<PatientWithDoctor | null>(null);

  const openCreate = useCallback(() => {
    setEditingPatient(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((patient: PatientWithDoctor) => {
    setEditingPatient(patient);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((patient: PatientWithDoctor) => {
    setDeletingPatient(patient);
    setDeleteOpen(true);
  }, []);

  const error = patientsQuery.isError
    ? getErrorMessage(patientsQuery.error)
    : null;

  // A new patient is assigned to the doctor the list is filtered by.
  const defaultDoctorId = isObjectId(values.doctor) ? values.doctor : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage the patients and the doctor they are assigned to."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        }
      />

      <PatientsToolbar
        search={values.search}
        onSearchChange={handleSearchChange}
        conditions={optionsQuery.data?.conditions ?? []}
        condition={values.condition}
        onConditionChange={handleConditionChange}
        doctor={values.doctor}
        onDoctorChange={handleDoctorChange}
        gender={values.gender}
        onGenderChange={handleGenderChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        sort={values.sort}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {firstLoad ? (
        <TableSkeleton rows={Math.min(toPageSize(values.limit), 8)} columns={8} />
      ) : error && !patientsQuery.data ? (
        <ErrorState
          title="Could not load the patients"
          detail={error}
          onRetry={() => patientsQuery.refetch()}
          isRetrying={patientsQuery.isFetching}
        />
      ) : totalItems === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No patients match the filters"
            description="Try a different search, condition, doctor, gender or date range."
            action={{ label: "Clear filters", onClick: clearFilters }}
          />
        ) : (
          <EmptyState
            icon={UserRound}
            title="No patients yet"
            description="Add your first patient to start managing them."
            action={{ label: "Add your first patient", onClick: openCreate }}
          />
        )
      ) : (
        <div
          className={cn(
            "relative space-y-4 transition-opacity duration-200",
            fetchMore && "pointer-events-none opacity-60"
          )}
          aria-busy={fetchMore}
        >
          {fetchMore ? (
            <Loader2
              aria-label="Loading patients"
              className="absolute right-0 top-0 h-4 w-4 animate-spin text-muted-foreground"
            />
          ) : null}

          <PatientsTable
            patients={patients}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <PatientsCardList
            patients={patients}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <CustomPagination
            currentPage={meta?.page ?? values.page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={meta?.limit ?? toPageSize(values.limit)}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>
      )}

      <PatientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        patient={editingPatient}
        defaultDoctorId={defaultDoctorId}
      />

      <PatientDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        patient={deletingPatient}
      />
    </div>
  );
}
