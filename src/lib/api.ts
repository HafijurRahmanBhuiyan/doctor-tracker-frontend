import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const TOKEN_COOKIE_NAME = "dt_token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      if (status === 401) {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          Cookies.remove(TOKEN_COOKIE_NAME);
          // Axios interceptors run outside React tree; use hard navigation
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

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

/** The HTTP status of a failed request (e.g. 404 or 409), if there was one. */
export function getErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
