"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { AppointmentList } from "@/features/appointment/components/appointment-list";

export default function SchedulePage() {
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["staff"]}>
        <AppointmentList role="staff" />
      </RoleGuard>
    </ProtectedLayout>
  );
}
