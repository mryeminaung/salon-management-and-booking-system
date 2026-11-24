"use client";

import { RoleGuard } from "@/components/role-guard";
import { ProtectedLayout } from "@/components/protected-layout";
import { ManagerList } from "@/features/manager";

export default function AdminManagersPage() {
  return (
    <ProtectedLayout>
      <RoleGuard allowedRoles={["owner"]}>
        <ManagerList />
      </RoleGuard>
    </ProtectedLayout>
  );
}
