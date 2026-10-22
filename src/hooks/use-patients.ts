"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { dashboardKeys, doctorKeys, patientKeys } from "@/lib/query-keys";
import {
  createPatient,
  fetchPatient,
  fetchPatientFilterOptions,
  fetchPatients,
  removePatient,
  updatePatient,
} from "@/services/patients.service";
import type {
  PatientFilterOptions,
  PatientListParams,
} from "@/types";
import type { PatientFormValuesWithDoctor } from "@/lib/validations/patient";

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/** `GET /patients` — the paginated patient list. */
export function usePatients(params: PatientListParams) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => fetchPatients(params),
    // Keeps the previous page visible while the next one is loading.
    placeholderData: keepPreviousData,
  });
}

/** `GET /patients/:id` — a single patient. */
export function usePatient(id?: string) {
  return useQuery({
    queryKey: patientKeys.detail(id ?? ""),
    queryFn: () => fetchPatient(id as string),
    enabled: Boolean(id),
  });
}

/** `GET /patients/filters/options` — the conditions of the condition filter. */
export function usePatientFilterOptions() {
  return useQuery<PatientFilterOptions>({
    queryKey: patientKeys.filterOptions(),
    queryFn: fetchPatientFilterOptions,
    // The conditions only change when a patient is added, edited or removed.
    staleTime: 5 * 60 * 1000,
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/**
 * Invalidates everything a patient change can affect:
 *
 * - the patient lists and the filter options
 * - the dashboard statistics (they count the patients)
 * - the doctors: their patient count, their detail page and the patients
 *   that are assigned to them
 */
function invalidatePatientData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
  queryClient.invalidateQueries({ queryKey: patientKeys.details() });
  queryClient.invalidateQueries({ queryKey: patientKeys.filterOptions() });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
  queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
  queryClient.invalidateQueries({ queryKey: doctorKeys.details() });
  queryClient.invalidateQueries({ queryKey: doctorKeys.patients() });
}

/** `POST /patients` */
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatientFormValuesWithDoctor) => createPatient(payload),
    onSuccess: ({ message }) => {
      toast.success(message || "Patient created successfully");
      invalidatePatientData(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/** `PUT /patients/:id` */
export function useUpdatePatient(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatientFormValuesWithDoctor) =>
      updatePatient(patientId, payload),
    onSuccess: ({ message }) => {
      toast.success(message || "Patient updated successfully");
      invalidatePatientData(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/** `DELETE /patients/:id` */
export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => removePatient(patientId),
    onSuccess: ({ message }) => {
      toast.success(message || "Patient deleted successfully");
      invalidatePatientData(queryClient);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
