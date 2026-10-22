"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@teispace/next-themes";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-media-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // The toasts sit in the top right corner on desktop and in the top center
  // on mobile, so they never cover the pagination or the row actions.
  const isMobile = useIsMobile();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storage="local"
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          richColors
          position={isMobile ? "top-center" : "top-right"}
          duration={4000}
          closeButton
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
