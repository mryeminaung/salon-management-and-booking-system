"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { SalonList } from "@/features/salon";
import { CustomerSalons } from "@/features/appointment/components/customer-salons";
import { useAuthStore } from "@/stores/auth-store";

export default function SalonsPage() {
  const role = useAuthStore((state) => state.user?.role?.toLowerCase());
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["owner", "customer"]}>
        {role === "owner" ? <SalonList /> : <CustomerSalons />}
      </RoleGuard>
    </ProtectedLayout>
  );
}
