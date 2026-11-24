"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useSalonStore } from "@/features/salon";

/**
 * Returns the salonId for the current user.
 * - Owner: first salon (or selected)
 * - Manager/Staff: their assigned salon
 */
export function useUserSalon() {
  const user = useAuthStore((s) => s.user);
  const { salons, fetchSalons, isLoading } = useSalonStore();
  const [salonId, setSalonId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const role = user.role?.toLowerCase();

    if (role === "manager" || role === "staff") {
      setSalonId(user.salonId ?? null);
    } else if (role === "owner") {
      fetchSalons();
    }
  }, [user, fetchSalons]);

  useEffect(() => {
    const role = user?.role?.toLowerCase();
    if (role === "owner" && salons.length > 0 && !salonId) {
      setSalonId(salons[0].id);
    }
  }, [salons, salonId, user]);

  return { salonId, setSalonId, salons, isLoading };
}
