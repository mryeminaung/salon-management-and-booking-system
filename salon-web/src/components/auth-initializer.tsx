"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register"];

export function AuthInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Listen for 401 Unauthorized events from axios interceptor
  useEffect(() => {
    const handleUnauthorized = async () => {
      // Don't redirect to login if already on a public path
      const isPublicPath = PUBLIC_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
      );

      if (!isPublicPath) {
        await logout();
        router.push("/login");
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout, router, pathname]);

  return null;
}
