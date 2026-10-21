"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Stethoscope, Users, CalendarCheck, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import api, { getErrorMessage, TOKEN_COOKIE_NAME } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  message: string;
};

function getSafeNextPath(nextParam: string | null) {
  if (!nextParam) return "/dashboard";
  if (nextParam.startsWith("//")) return "/dashboard";
  if (nextParam.startsWith("/")) return nextParam;
  return "/dashboard";
}

function setAuthCookie(token: string) {
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 1,
    sameSite: "lax",
    secure: isSecure,
    path: "/",
  });
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const showDemoCredentials =
    process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await api.post<LoginResponse>("/auth/login", values);
      return res.data;
    },
    onSuccess: (data) => {
      setAuthCookie(data.data.token);
      queryClient.setQueryData(["auth", "me"], { user: data.data.user });
      toast.success(data.message || "Login successful");
      router.replace(nextPath);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const fillDemoCredentials = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin@12345", { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />
            <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center gap-2 p-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Doctor Tracker</span>
          </div>
          <div className="relative z-10 space-y-8 p-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Manage doctors and patients with clarity
              </h1>
              <p className="max-w-md text-lg text-white/80">
                A secure admin portal to keep your practice organized, track trends, and stay on top of patient care.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Centralized records</p>
                  <p className="text-sm text-white/70">Keep doctors and patients in one secure place.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <CalendarCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Actionable insights</p>
                  <p className="text-sm text-white/70">Track trends and stay informed at a glance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Secure access</p>
                  <p className="text-sm text-white/70">Role-based admin access keeps data protected.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 p-10 text-sm text-white/60">© {new Date().getFullYear()} Doctor Tracker</div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-10">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold">Doctor Tracker</span>
          </div>
          <Card className="w-full max-w-md rounded-xl shadow-lg">
            <CardHeader className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the admin portal</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {showDemoCredentials ? (
                <div className="rounded-lg border bg-muted/40 p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">Demo credentials</p>
                      <p className="text-muted-foreground">admin@doctortracker.com / Admin@12345</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={fillDemoCredentials}>
                      Click to fill
                    </Button>
                  </div>
                </div>
              ) : null}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@doctortracker.com" autoFocus {...register("email")} />
                  {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pr-10" {...register("password")} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0.5 top-0.5 h-8 w-8" onClick={() => setShowPassword((p) => !p)} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  );
}
