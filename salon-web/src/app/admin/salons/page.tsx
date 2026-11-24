"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { SalonList } from "@/features/salon";

export default function AdminSalonsPage() {
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["owner"]}>
        <SalonList />
      </RoleGuard>
    </ProtectedLayout>
  );
}
