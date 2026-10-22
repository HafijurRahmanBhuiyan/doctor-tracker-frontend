"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { doctorKeys } from "@/lib/query-keys";
import {
  addDoctorPatient,
  createDoctor,
  deleteDoctor,
  fetchDoctor,
  fetchDoctorFilterOptions,
  fetchDoctorPatients,
  fetchDoctors,
  removeDoctorPatient,
  updateDoctor,
} from "@/services/doctors.service";
import type {
  DoctorFilterOptions,
  DoctorListParams,
  DoctorPatient,
  DoctorPatientsParams,
  DoctorWithPatientCount,
  PaginatedData,
} from "@/types";
import type { DoctorFormValues } from "@/lib/validations/doctor";
import type { PatientFormValues } from "@/lib/validations/patient";

/**
 * Counter for the temporary id of an optimistically added patient.
 * A counter is used instead of `Date.now()` so nothing time dependent ever
 * ends up in the rendered markup.
 */
let optimisticPatientId = 0;

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/** `GET /doctors` — the paginated doctor list. */
export function useDoctors(params: DoctorListParams) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => fetchDoctors(params),
    // Keeps the previous page visible while the next one is loading.
    placeholderData: keepPreviousData,
  });
}

/** `GET /doctors/:id` — a single doctor with their patient count. */
export function useDoctor(id?: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id ?? ""),
    queryFn: () => fetchDoctor(id as string),
    enabled: Boolean(id),
  });
}

/** `GET /doctors/filters/options` — specializations and hospitals. */
export function useDoctorFilterOptions() {
  return useQuery<DoctorFilterOptions>({
    queryKey: doctorKeys.filterOptions(),
    queryFn: fetchDoctorFilterOptions,
    // The options only change when a doctor is added, edited or removed.
    staleTime: 5 * 60 * 1000,
  });
}

/** `GET /doctors/:id/patients` — the patients of one doctor. */
export function useDoctorPatients(
  doctorId?: string,
  params: DoctorPatientsParams = {}
) {
  return useQuery({
    queryKey: doctorKeys.patientList(doctorId ?? "", params),
    queryFn: () => fetchDoctorPatients(doctorId as string, params),
    placeholderData: keepPreviousData,
    enabled: Boolean(doctorId),
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/** `POST /doctors` */
export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DoctorFormValues) => createDoctor(payload),
    onSuccess: ({ message }) => {
      toast.success(message || "Doctor created successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/** `PUT /doctors/:id` */
export function useUpdateDoctor(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DoctorFormValues) => updateDoctor(doctorId, payload),
    onSuccess: ({ message }) => {
      toast.success(message || "Doctor updated successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(doctorId) });
      queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/** `DELETE /doctors/:id` — also removes all patients of the doctor. */
export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => deleteDoctor(doctorId),
    onSuccess: ({ message }, doctorId) => {
      toast.success(message || "Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.details() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.patients() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.filterOptions() });
      queryClient.removeQueries({ queryKey: doctorKeys.detail(doctorId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * `POST /doctors/:id/patients`
 *
 * The patient is added optimistically: the list and the patient count of the
 * doctor update right away and are rolled back when the request fails.
 */
export function useAddDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatientFormValues) =>
      addDoctorPatient(doctorId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: doctorKeys.patientLists(doctorId),
      });
      await queryClient.cancelQueries({
        queryKey: doctorKeys.detail(doctorId),
      });

      const previousLists = queryClient.getQueriesData<
        PaginatedData<DoctorPatient>
      >({ queryKey: doctorKeys.patientLists(doctorId) });
      const previousDoctor = queryClient.getQueryData<DoctorWithPatientCount>(
        doctorKeys.detail(doctorId)
      );

      optimisticPatientId += 1;
      const optimisticPatient: DoctorPatient = {
        _id: `optimistic-${optimisticPatientId}`,
        name: payload.name,
        age: payload.age,
        gender: payload.gender,
        phone: payload.phone,
        email: payload.email || undefined,
        condition: payload.condition,
        notes: payload.notes || undefined,
        doctor: doctorId,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueriesData<PaginatedData<DoctorPatient>>(
        { queryKey: doctorKeys.patientLists(doctorId) },
        (old) => {
          if (!old) return old;

          const total = old.meta.total + 1;
          return {
            data: [optimisticPatient, ...old.data],
            meta: {
              ...old.meta,
              total,
              totalPages: Math.max(1, Math.ceil(total / old.meta.limit)),
            },
          };
        }
      );

      queryClient.setQueryData<DoctorWithPatientCount>(
        doctorKeys.detail(doctorId),
        (old) => (old ? { ...old, patientCount: old.patientCount + 1 } : old)
      );

      return { previousLists, previousDoctor };
    },
    onError: (error, _payload, context) => {
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.previousDoctor) {
        queryClient.setQueryData(
          doctorKeys.detail(doctorId),
          context.previousDoctor
        );
      }
      toast.error(getErrorMessage(error));
    },
    onSuccess: ({ message }) => {
      toast.success(message || "Patient added successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: doctorKeys.patientLists(doctorId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(doctorId) });
    },
  });
}

/**
 * `DELETE /doctors/:id/patients/:patientId`
 *
 * The patient is removed optimistically and the change is rolled back when
 * the request fails.
 */
export function useRemoveDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId }: { patientId: string }) =>
      removeDoctorPatient(doctorId, patientId),
    onMutate: async ({ patientId }) => {
      await queryClient.cancelQueries({
        queryKey: doctorKeys.patientLists(doctorId),
      });
      await queryClient.cancelQueries({
        queryKey: doctorKeys.detail(doctorId),
      });

      const previousLists = queryClient.getQueriesData<
        PaginatedData<DoctorPatient>
      >({ queryKey: doctorKeys.patientLists(doctorId) });
      const previousDoctor = queryClient.getQueryData<DoctorWithPatientCount>(
        doctorKeys.detail(doctorId)
      );

      queryClient.setQueriesData<PaginatedData<DoctorPatient>>(
        { queryKey: doctorKeys.patientLists(doctorId) },
        (old) => {
          if (!old) return old;

          const total = Math.max(0, old.meta.total - 1);
          return {
            data: old.data.filter((patient) => patient._id !== patientId),
            meta: {
              ...old.meta,
              total,
              totalPages: Math.max(1, Math.ceil(total / old.meta.limit)),
            },
          };
        }
      );

      queryClient.setQueryData<DoctorWithPatientCount>(
        doctorKeys.detail(doctorId),
        (old) =>
          old ? { ...old, patientCount: Math.max(0, old.patientCount - 1) } : old
      );

      return { previousLists, previousDoctor };
    },
    onError: (error, _variables, context) => {
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.previousDoctor) {
        queryClient.setQueryData(
          doctorKeys.detail(doctorId),
          context.previousDoctor
        );
      }
      toast.error(getErrorMessage(error));
    },
    onSuccess: ({ message }) => {
      toast.success(message || "Patient removed successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: doctorKeys.patientLists(doctorId),
      });
      queryClient.invalidateQueries({ queryKey: doctorKeys.detail(doctorId) });
    },
  });
}
