"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, SearchX, Stethoscope } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { CustomPagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api";
import { parseDateParam, formatDateParam } from "@/lib/date-range";
import { useDoctorFilterOptions, useDoctors } from "@/hooks/use-doctors";
import { useUrlState } from "@/hooks/use-url-state";
import { DoctorsToolbar } from "./doctors-toolbar";
import { DoctorsCardList, DoctorsTable } from "./doctors-list";
import { DoctorDeleteDialog } from "./doctor-delete-dialog";
import { DoctorFormDialog } from "./doctor-form-dialog";
import type {
  DoctorListParams,
  DoctorSort,
  DoctorWithPatientCount,
} from "@/types";

type DoctorsUrlState = {
  search: string;
  specialization: string;
  hospital: string;
  /** YYYY-MM-DD */
  from: string;
  /** YYYY-MM-DD */
  to: string;
  sort: DoctorSort;
  page: number;
  limit: number;
};

/** Defaults for every doctor list param; the URL overrides them. */
const DEFAULT_DOCTORS_URL_STATE: DoctorsUrlState = {
  search: "",
  specialization: "",
  hospital: "",
  from: "",
  to: "",
  sort: "newest",
  page: 1,
  limit: 10,
};

const SORT_CONFIG: Record<
  DoctorSort,
  { sortBy: "createdAt" | "name"; order: "asc" | "desc" }
> = {
  newest: { sortBy: "createdAt", order: "desc" },
  oldest: { sortBy: "createdAt", order: "asc" },
  "name-asc": { sortBy: "name", order: "asc" },
  "name-desc": { sortBy: "name", order: "desc" },
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/**
 * The doctors page. Every bit of state (search, filters, dates, sort, page
 * and page size) lives in the URL, so a link restores exactly the same view.
 */
export function DoctorsView() {
  const router = useRouter();

  const { values, setParams, resetParams } = useUrlState<DoctorsUrlState>(
    DEFAULT_DOCTORS_URL_STATE
  );

  const optionsQuery = useDoctorFilterOptions();
  const doctorsQuery = useDoctors(
    useMemo<DoctorListParams>(() => {
      const sort = SORT_CONFIG[values.sort] ?? SORT_CONFIG.newest;

      return {
        page: values.page,
        limit: values.limit,
        search: values.search || undefined,
        specialization: values.specialization || undefined,
        hospital: values.hospital || undefined,
        from: values.from || undefined,
        to: values.to || undefined,
        sortBy: sort.sortBy,
        order: sort.order,
      };
      // `values` fields are stable, so the query params only change when
      // the URL actually changes.
    }, [
      values.search,
      values.specialization,
      values.hospital,
      values.from,
      values.to,
      values.sort,
      values.page,
      values.limit,
    ])
  );

  const hasActiveFilters = Boolean(
    values.search ||
      values.specialization ||
      values.hospital ||
      values.from ||
      values.to
  );

  const doctors = useMemo(
    () => doctorsQuery.data?.data ?? [],
    [doctorsQuery.data]
  );
  const meta = doctorsQuery.data?.meta;
  const totalItems = meta?.total ?? 0;

  const firstLoad = doctorsQuery.isPending;
  const fetchMore = doctorsQuery.isFetching && !doctorsQuery.isPending;

  // A page that no longer exists (e.g. the filters changed) is corrected to
  // the last available page.
  const totalPages = meta?.totalPages ?? 1;
  useEffect(() => {
    if (!doctorsQuery.data) return;
    if (doctorsQuery.data.meta.total === 0) return;
    if (totalPages > 0 && values.page > totalPages) {
      setParams({ page: totalPages });
    }
  }, [doctorsQuery.data, setParams, totalPages, values.page]);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */

  const handleSearchChange = useCallback(
    (search: string) => {
      setParams({ search }, { reset: ["page"] });
    },
    [setParams]
  );

  const handleSpecializationChange = useCallback(
    (specialization: string) => {
      setParams({ specialization }, { reset: ["page"] });
    },
    [setParams]
  );

  const handleHospitalChange = useCallback(
    (hospital: string) => {
      setParams({ hospital }, { reset: ["page"] });
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
    (sort: DoctorSort) => {
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
    resetParams(["search", "specialization", "hospital", "from", "to", "page"]);
  }, [resetParams]);

  const openDetail = useCallback(
    (doctorId: string) => {
      router.push(`/doctors/${doctorId}`);
    },
    [router]
  );

  /* ---------------------------------------------------------------- */
  /* Dialog state                                                      */
  /* ---------------------------------------------------------------- */

  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] =
    useState<DoctorWithPatientCount | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingDoctor, setDeletingDoctor] =
    useState<DoctorWithPatientCount | null>(null);

  const openCreate = useCallback(() => {
    setEditingDoctor(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((doctor: DoctorWithPatientCount) => {
    setEditingDoctor(doctor);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((doctor: DoctorWithPatientCount) => {
    setDeletingDoctor(doctor);
    setDeleteOpen(true);
  }, []);

  const error = doctorsQuery.isError
    ? getErrorMessage(doctorsQuery.error)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage the doctors and their practices."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        }
      />

      <DoctorsToolbar
        search={values.search}
        onSearchChange={handleSearchChange}
        specializations={optionsQuery.data?.specializations ?? []}
        specialization={values.specialization}
        onSpecializationChange={handleSpecializationChange}
        hospitals={optionsQuery.data?.hospitals ?? []}
        hospital={values.hospital}
        onHospitalChange={handleHospitalChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        sort={values.sort}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {firstLoad ? (
        <TableSkeleton rows={Math.min(values.limit, 8)} columns={6} />
      ) : error && !doctorsQuery.data ? (
        <ErrorState
          title="Could not load the doctors"
          detail={error}
          onRetry={() => doctorsQuery.refetch()}
          isRetrying={doctorsQuery.isFetching}
        />
      ) : totalItems === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No doctors match the filters"
            description="Try a different search, specialization, hospital or date range."
            action={{ label: "Clear filters", onClick: clearFilters }}
          />
        ) : (
          <EmptyState
            icon={Stethoscope}
            title="No doctors yet"
            description="Add your first doctor to start managing their patients."
            action={{ label: "Add your first doctor", onClick: openCreate }}
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
              aria-label="Loading doctors"
              className="absolute right-0 top-0 h-4 w-4 animate-spin text-muted-foreground"
            />
          ) : null}

          <DoctorsTable
            doctors={doctors}
            onOpen={openDetail}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <DoctorsCardList
            doctors={doctors}
            onOpen={openDetail}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <CustomPagination
            currentPage={meta?.page ?? values.page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={meta?.limit ?? values.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>
      )}

      <DoctorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={editingDoctor}
      />

      <DoctorDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        doctor={deletingDoctor}
      />
    </div>
  );
}
