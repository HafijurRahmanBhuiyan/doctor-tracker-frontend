import type {
  DoctorListParams,
  DoctorPatientsParams,
  PatientListParams,
} from "@/types";

/**
 * Central query key factory for the doctors feature.
 *
 * Every hook derives its key from this object, so invalidating a single
 * prefix invalidates all the queries below it:
 *
 * - `doctorKeys.lists()` -> every doctor list (any filter combination)
 * - `doctorKeys.details()` -> every single doctor
 * - `doctorKeys.patientLists(id)` -> every patient list of one doctor
 */
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params: DoctorListParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  filterOptions: () => [...doctorKeys.all, "filter-options"] as const,
  patients: () => [...doctorKeys.all, "patients"] as const,
  patientLists: (doctorId: string) =>
    [...doctorKeys.patients(), doctorId, "list"] as const,
  patientList: (doctorId: string, params: DoctorPatientsParams) =>
    [...doctorKeys.patientLists(doctorId), params] as const,
};

/**
 * Central query key factory for the patients feature.
 *
 * - `patientKeys.lists()` -> every patient list (any filter combination)
 * - `patientKeys.details()` -> every single patient
 * - `patientKeys.filterOptions()` -> the values of the condition filter
 */
export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: PatientListParams) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  filterOptions: () => [...patientKeys.all, "filter-options"] as const,
};

/**
 * Central query key factory for the dashboard.
 *
 * - `dashboardKeys.stats()` -> the aggregated dashboard statistics
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};
