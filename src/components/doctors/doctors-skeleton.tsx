import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/common/table-skeleton";

type DoctorsPageSkeletonProps = {
  rows?: number;
};

/** Skeleton shown while the doctors page streams in (Suspense fallback). */
export function DoctorsPageSkeleton({ rows = 6 }: DoctorsPageSkeletonProps) {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <DoctorsListSkeleton rows={rows} />
    </div>
  );
}

/** Skeleton for the doctor list, used while the first page loads. */
export function DoctorsListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full sm:w-64" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-40" />
      </div>

      <TableSkeleton rows={rows} columns={6} />
    </div>
  );
}

/** Skeleton for a single doctor page (detail view fallback). */
export function DoctorDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-5 w-56" />

      <div className="rounded-xl border bg-card">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-full sm:w-64" />
            <Skeleton className="h-9 w-32" />
          </div>
          <TableSkeleton rows={4} columns={5} />
        </div>
      </div>
    </div>
  );
}
