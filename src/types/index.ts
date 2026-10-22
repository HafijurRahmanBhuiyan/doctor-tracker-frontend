export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  message: string;
  meta?: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserRole = "admin" | "doctor";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Gender = "male" | "female" | "other";

/**
 * A doctor as returned by the create / update endpoints.
 * Those responses do not carry a patient count.
 */
export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  updatedAt: string;
};

/**
 * A doctor as returned by the list and the detail endpoints.
 * Both add the number of patients assigned to the doctor.
 */
export type DoctorWithPatientCount = Doctor & {
  patientCount: number;
};

/** Options used to populate the specialization / hospital filters. */
export type DoctorFilterOptions = {
  specializations: string[];
  hospitals: string[];
};

/** Sort options offered by the doctors list. */
export type DoctorSort = "newest" | "oldest" | "name-asc" | "name-desc";

/** Query parameters accepted by `GET /doctors`. */
export type DoctorListParams = {
  page?: number;
  limit?: number;
  /** Matched against the name and the email. */
  search?: string;
  specialization?: string;
  hospital?: string;
  /** YYYY-MM-DD */
  from?: string;
  /** YYYY-MM-DD */
  to?: string;
  sortBy?: "createdAt" | "name";
  order?: "asc" | "desc";
};

/** Query parameters accepted by `GET /doctors/:id/patients`. */
export type DoctorPatientsParams = {
  page?: number;
  limit?: number;
  /** Matched against the name and the condition. */
  search?: string;
};

export type PatientDoctor = {
  _id: string;
  name: string;
  specialization: string;
};

export type Patient = {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  notes?: string;
  doctor: PatientDoctor | string;
  createdAt: string;
  updatedAt?: string;
};

/**
 * A patient of the "patients of a doctor" list. The `doctor` field is the
 * raw ObjectId (the query is not populated), never a doctor object.
 */
export type DoctorPatient = Omit<Patient, "doctor"> & {
  doctor: string;
};

/**
 * A patient of the patients list / detail. The backend populates the doctor,
 * so it always carries the name and the specialization of the doctor.
 */
export type PatientWithDoctor = Omit<Patient, "doctor"> & {
  doctor: PatientDoctor;
};

/** The `sortBy` values the backend accepts for the patients list. */
export type PatientSortBy = "createdAt" | "name" | "age" | "condition";

/** Sort options offered by the patients list. */
export type PatientSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "age-asc"
  | "age-desc"
  | "condition";

/** Query parameters accepted by `GET /patients`. */
export type PatientListParams = {
  page?: number;
  limit?: number;
  /** Matched against the name and the condition. */
  search?: string;
  /** Exact condition. */
  condition?: string;
  /** ObjectId of the doctor the patient is assigned to. */
  doctor?: string;
  gender?: Gender;
  /** YYYY-MM-DD */
  from?: string;
  /** YYYY-MM-DD */
  to?: string;
  sortBy?: PatientSortBy;
  order?: "asc" | "desc";
};

/** Options used to populate the condition filter. */
export type PatientFilterOptions = {
  conditions: string[];
};

/** A list payload together with its pagination meta. */
export type PaginatedData<T> = {
  data: T[];
  meta: PaginationMeta;
};

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

/** Inclusive date range sent to the API as YYYY-MM-DD strings. */
export type DashboardDateRange = {
  from?: string;
  to?: string;
};

export type DashboardTotals = {
  doctors: number;
  patients: number;
};

export type DashboardPatientPerDoctor = {
  doctorId: string;
  name: string;
  specialization: string;
  count: number;
};

export type DashboardPatientOverTime = {
  /** YYYY-MM-DD */
  date: string;
  count: number;
};

export type DashboardDoctorOverTime = {
  /** YYYY-MM */
  month: string;
  count: number;
};

export type DashboardConditionCount = {
  condition: string;
  count: number;
};

export type DashboardSpecializationCount = {
  specialization: string;
  count: number;
};

export type DashboardGenderCount = {
  gender: string;
  count: number;
};

export type DashboardRecentPatient = {
  patientId: string;
  name: string;
  condition: string;
  doctorName: string | null;
  /** ISO date string */
  createdAt: string;
};

export type DashboardStats = {
  totals: DashboardTotals;
  patientsAddedLast7Days: number;
  patientsAddedLast30Days: number;
  patientsPerDoctor: DashboardPatientPerDoctor[];
  patientsOverTime: DashboardPatientOverTime[];
  doctorsOverTime: DashboardDoctorOverTime[];
  conditionDistribution: DashboardConditionCount[];
  specializationDistribution: DashboardSpecializationCount[];
  genderDistribution: DashboardGenderCount[];
  recentPatients: DashboardRecentPatient[];
};
