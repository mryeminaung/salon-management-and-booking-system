"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { StaffProfile } from "@/features/staff/components/staff-profile";

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["staff"]}>
        <StaffProfile />
      </RoleGuard>
    </ProtectedLayout>
  );
}
