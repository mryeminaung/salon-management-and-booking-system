"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { AppointmentList } from "@/features/appointment/components/appointment-list";
import { useAuthStore } from "@/stores/auth-store";

export default function AppointmentsPage() {
  const role = useAuthStore((state) => state.user?.role?.toLowerCase());
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["manager", "customer"]}>
        <AppointmentList role={role === "manager" ? "manager" : "customer"} />
      </RoleGuard>
    </ProtectedLayout>
  );
}
