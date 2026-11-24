"use client";

import { PageHeader } from "@/components/page-header";
import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	StaffForm,
	StaffList,
	useStaffStore,
	type Staff,
} from "@/features/staff";
import { useUserSalon } from "@/hooks/use-user-salon";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function StaffPage() {
	const { salonId, isLoading } = useUserSalon();
	const { addStaff, updateStaff } = useStaffStore();

	const [showForm, setShowForm] = useState(false);
	const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

	return (
		<ProtectedLayout>
			<RoleGuard allowedRoles={["manager"]}>
				<div className="space-y-4">
					<PageHeader
						title="Staff"
						description="Add, edit, and manage staff members."
						action={
							<Button
								onClick={() => {
									setEditingStaff(null);
									setShowForm(true);
								}}>
								<PlusIcon className="size-4" /> Add Staff
							</Button>
						}
					/>
					<Separator />

					{isLoading ? (
						<p className="text-muted-foreground">Loading...</p>
					) : salonId ? (
						<StaffList
							salonId={salonId}
							onEdit={(s) => {
								setEditingStaff(s);
								setShowForm(true);
							}}
						/>
					) : (
						<p className="text-muted-foreground">
							No salons yet. Create a salon first.
						</p>
					)}
				</div>

				<StaffForm
					open={showForm}
					onOpenChange={(open) => {
						setShowForm(open);
						if (!open) setEditingStaff(null);
					}}
					staff={editingStaff}
					onSubmit={
						editingStaff
							? (data) => updateStaff(editingStaff.id, { name: data.name, phone: data.phone, specialty: data.specialty || undefined })
							: (data) => addStaff({ name: data.name, email: data.email, password: data.password, phone: data.phone, specialty: data.specialty || undefined })
					}
				/>
			</RoleGuard>
		</ProtectedLayout>
	);
}
