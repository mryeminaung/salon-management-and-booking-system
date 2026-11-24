"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const ROLE_HOME: Record<string, string> = {
  owner: "/admin/dashboard",
  manager: "/dashboard",
  staff: "/dashboard",
  customer: "/dashboard",
};

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const normalizedRole = user.role?.toLowerCase();
    if (!allowedRoles.includes(normalizedRole)) {
      router.replace(ROLE_HOME[normalizedRole] || "/login");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  const normalizedRole = user.role?.toLowerCase();
  if (!allowedRoles.includes(normalizedRole)) return null;

  return <>{children}</>;
}
