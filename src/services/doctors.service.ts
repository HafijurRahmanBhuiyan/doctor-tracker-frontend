import api, { type ApiResponse, type ServiceResult } from "@/lib/api";
import type {
  Doctor,
  DoctorFilterOptions,
  DoctorListParams,
  DoctorPatient,
  DoctorPatientsParams,
  DoctorWithPatientCount,
  PaginatedData,
  Patient,
} from "@/types";
import type { DoctorFormValues } from "@/lib/validations/doctor";
import type { PatientFormValues } from "@/lib/validations/patient";

/**
 * A payload plus the message the backend sent with it.
 *
 * The type lives in `@/lib/api` (it is shared with the patients service) and
 * is re-exported here to keep the existing import path working.
 */
export type { ServiceResult };

function toQuery(params: Record<string, string | number | undefined>) {
  const query: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    query[key] = value;
  });

  return query;
}

function doctorQuery(params: DoctorListParams) {
  return toQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    specialization: params.specialization,
    hospital: params.hospital,
    from: params.from,
    to: params.to,
    sortBy: params.sortBy,
    order: params.order,
  });
}

function patientQuery(params: DoctorPatientsParams) {
  return toQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
  });
}

/** `GET /doctors` — a paginated list of doctors including their patient count. */
export async function fetchDoctors(
  params: DoctorListParams = {}
): Promise<PaginatedData<DoctorWithPatientCount>> {
  const res = await api.get<ApiResponse<DoctorWithPatientCount[]>>("/doctors", {
    params: doctorQuery(params),
  });

  return {
    data: res.data.data ?? [],
    meta: res.data.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

/** `GET /doctors/filters/options` — the values available for the filters. */
export async function fetchDoctorFilterOptions(): Promise<DoctorFilterOptions> {
  const res = await api.get<ApiResponse<DoctorFilterOptions>>(
    "/doctors/filters/options"
  );

  return {
    specializations: res.data.data?.specializations ?? [],
    hospitals: res.data.data?.hospitals ?? [],
  };
}

/** `GET /doctors/:id` — a single doctor including their patient count. */
export async function fetchDoctor(id: string): Promise<DoctorWithPatientCount> {
  const res = await api.get<ApiResponse<{ doctor: DoctorWithPatientCount }>>(
    `/doctors/${id}`
  );

  return res.data.data.doctor;
}

/** `POST /doctors` — creates a doctor. */
export async function createDoctor(
  payload: DoctorFormValues
): Promise<ServiceResult<Doctor>> {
  const res = await api.post<ApiResponse<{ doctor: Doctor }>>("/doctors", payload);

  return { data: res.data.data.doctor, message: res.data.message };
}

/** `PUT /doctors/:id` — updates a doctor. */
export async function updateDoctor(
  id: string,
  payload: DoctorFormValues
): Promise<ServiceResult<Doctor>> {
  const res = await api.put<ApiResponse<{ doctor: Doctor }>>(
    `/doctors/${id}`,
    payload
  );

  return { data: res.data.data.doctor, message: res.data.message };
}

/** `DELETE /doctors/:id` — removes a doctor and all of their patients. */
export async function deleteDoctor(id: string): Promise<ServiceResult<null>> {
  const res = await api.delete<ApiResponse<null>>(`/doctors/${id}`);

  return { data: res.data.data ?? null, message: res.data.message };
}

/** `GET /doctors/:id/patients` — the paginated patients of one doctor. */
export async function fetchDoctorPatients(
  doctorId: string,
  params: DoctorPatientsParams = {}
): Promise<PaginatedData<DoctorPatient>> {
  const res = await api.get<ApiResponse<DoctorPatient[]>>(
    `/doctors/${doctorId}/patients`,
    { params: patientQuery(params) }
  );

  return {
    data: res.data.data ?? [],
    meta: res.data.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

/** `POST /doctors/:id/patients` — adds a patient to a doctor. */
export async function addDoctorPatient(
  doctorId: string,
  payload: PatientFormValues
): Promise<ServiceResult<Patient>> {
  const res = await api.post<ApiResponse<{ patient: Patient }>>(
    `/doctors/${doctorId}/patients`,
    {
      name: payload.name,
      age: payload.age,
      gender: payload.gender,
      phone: payload.phone,
      email: payload.email || undefined,
      condition: payload.condition,
      notes: payload.notes || undefined,
    }
  );

  return { data: res.data.data.patient, message: res.data.message };
}

/** `DELETE /doctors/:id/patients/:patientId` — removes a patient. */
export async function removeDoctorPatient(
  doctorId: string,
  patientId: string
): Promise<ServiceResult<null>> {
  const res = await api.delete<ApiResponse<null>>(
    `/doctors/${doctorId}/patients/${patientId}`
  );

  return { data: res.data.data ?? null, message: res.data.message };
}
