"use client";

import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Shown when the doctor detail request ends with a 404. */
export function DoctorNotFound() {
  return (
    <Card role="alert" className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-medium">Doctor not found</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This doctor does not exist or has been deleted.
          </p>
        </div>
        <Button asChild>
          <Link href="/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to doctors
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
