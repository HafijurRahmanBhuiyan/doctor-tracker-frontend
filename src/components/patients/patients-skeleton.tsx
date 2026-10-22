import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/common/table-skeleton";

type PatientsPageSkeletonProps = {
  rows?: number;
};

/** Skeleton shown while the patients page streams in (Suspense fallback). */
export function PatientsPageSkeleton({ rows = 6 }: PatientsPageSkeletonProps) {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <PatientsListSkeleton rows={rows} />
    </div>
  );
}

/** Skeleton for the patient list, used while the first page loads. */
export function PatientsListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full sm:w-64" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-44" />
      </div>

      <TableSkeleton rows={rows} columns={8} />
    </div>
  );
}
