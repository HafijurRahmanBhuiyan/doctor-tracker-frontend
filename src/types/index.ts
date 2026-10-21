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
