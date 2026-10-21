"use client";

import { useAuth } from "@/hooks/use-auth";
import { useHydrated } from "@/hooks/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const { isLoading } = useAuth();

  // Until the tree is hydrated the auth state is unknown, so the loading
  // state is rendered on the server *and* on the first client render. This
  // keeps both renders identical and avoids a hydration mismatch.
  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
