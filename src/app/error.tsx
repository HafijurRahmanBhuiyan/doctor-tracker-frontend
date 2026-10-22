"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-12">
      <Card className="w-full border-dashed">
        <CardContent className="space-y-4 py-10 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            The page could not load. Please try again.
          </p>
          <Button onClick={() => retry()} aria-label="Retry loading page">
            Retry
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
