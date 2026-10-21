"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api, { TOKEN_COOKIE_NAME } from "@/lib/api";
import { useHydrated } from "@/hooks/use-hydrated";

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
  // The token cookie is never read while rendering: the request is only
  // started once the component tree is hydrated, so the server render and the
  // first client render stay identical.
  const hydrated = useHydrated();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<MeResponse>("/auth/me");
      return res.data.data.user;
    },
    enabled: hydrated,
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
    // Stays `true` until the request settles (success or failure), which keeps
    // the loading state stable between the server render and the first client
    // render.
    isLoading: hydrated && query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    logout,
    refetch: query.refetch,
  };
}
