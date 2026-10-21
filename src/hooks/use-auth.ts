"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api, { TOKEN_COOKIE_NAME } from "@/lib/api";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type MeResponse = {
  success: boolean;
  data: {
    user: AuthUser;
  };
};

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const hasToken =
    typeof window !== "undefined" ? !!Cookies.get(TOKEN_COOKIE_NAME) : false;

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<MeResponse>("/auth/me");
      return res.data.data.user;
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    queryClient.clear();
    router.replace("/login");
  };

  return {
    user: query.data ?? null,
    isLoading: hasToken && query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    logout,
    refetch: query.refetch,
  };
}
