import api, { type ApiResponse, type ServiceResult } from "@/lib/api";
import type {
  PatientFilterOptions,
  PatientListParams,
  PatientWithDoctor,
  PaginatedData,
} from "@/types";
import type { PatientFormValuesWithDoctor } from "@/lib/validations/patient";

/**
 * The patients service.
 *
 * It talks to the admin only patient endpoints of the backend
 * (`backend/src/routes/patients.ts`):
 *
 * - `GET    /patients`             -> the paginated list (the doctor is populated)
 * - `GET    /patients/filters/options` -> the conditions of the condition filter
 * - `GET    /patients/:id`         -> a single patient
 * - `POST   /patients`             -> creates a patient
 * - `PUT    /patients/:id`         -> updates a patient
 * - `DELETE /patients/:id`         -> removes a patient
 *
 * The list accepts `page` (>= 1), `limit` (default 10, max 50), `search`
 * (name or condition), `condition`, `doctor` (ObjectId), `gender`
 * (`male | female | other`), `from` / `to` (YYYY-MM-DD) and the sorting
 * (`sortBy` in `createdAt | name | age | condition`, `order` in `asc | desc`).
 */

function toQuery(params: Record<string, string | number | undefined>) {
  const query: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    query[key] = value;
  });

  return query;
}

function patientQuery(params: PatientListParams) {
  return toQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    condition: params.condition,
    doctor: params.doctor,
    gender: params.gender,
    from: params.from,
    to: params.to,
    sortBy: params.sortBy,
    order: params.order,
  });
}

/** `GET /patients` — a paginated list of patients including their doctor. */
export async function fetchPatients(
  params: PatientListParams = {}
): Promise<PaginatedData<PatientWithDoctor>> {
  const res = await api.get<ApiResponse<PatientWithDoctor[]>>("/patients", {
    params: patientQuery(params),
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

/** `GET /patients/filters/options` — the conditions of the condition filter. */
export async function fetchPatientFilterOptions(): Promise<PatientFilterOptions> {
  const res = await api.get<ApiResponse<PatientFilterOptions>>(
    "/patients/filters/options"
  );

  return {
    conditions: res.data.data?.conditions ?? [],
  };
}

/** `GET /patients/:id` — a single patient including their doctor. */
export async function fetchPatient(
  id: string
): Promise<PatientWithDoctor> {
  const res = await api.get<ApiResponse<{ patient: PatientWithDoctor }>>(
    `/patients/${id}`
  );

  return res.data.data.patient;
}

/** `POST /patients` — creates a patient. */
export async function createPatient(
  payload: PatientFormValuesWithDoctor
): Promise<ServiceResult<PatientWithDoctor>> {
  const res = await api.post<ApiResponse<{ patient: PatientWithDoctor }>>(
    "/patients",
    payload
  );

  return { data: res.data.data.patient, message: res.data.message };
}

/** `PUT /patients/:id` — updates a patient (the doctor can be reassigned). */
export async function updatePatient(
  id: string,
  payload: PatientFormValuesWithDoctor
): Promise<ServiceResult<PatientWithDoctor>> {
  const res = await api.put<ApiResponse<{ patient: PatientWithDoctor }>>(
    `/patients/${id}`,
    payload
  );

  return { data: res.data.data.patient, message: res.data.message };
}

/** `DELETE /patients/:id` — removes a patient. */
export async function removePatient(
  id: string
): Promise<ServiceResult<null>> {
  const res = await api.delete<ApiResponse<null>>(`/patients/${id}`);

  return { data: res.data.data ?? null, message: res.data.message };
}
