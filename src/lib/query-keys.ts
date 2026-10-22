import type { DoctorListParams, DoctorPatientsParams } from "@/types";

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
