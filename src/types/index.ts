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

export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  createdAt: string;
  updatedAt?: string;
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
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  condition: string;
  notes?: string;
  doctor: PatientDoctor | string;
  createdAt: string;
  updatedAt?: string;
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
