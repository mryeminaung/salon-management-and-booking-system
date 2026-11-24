"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { StaffSchedule } from "@/features/staff/components/staff-schedule";

export default function SchedulePage() {
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["staff"]}>
        <StaffSchedule />
      </RoleGuard>
    </ProtectedLayout>
  );
}
