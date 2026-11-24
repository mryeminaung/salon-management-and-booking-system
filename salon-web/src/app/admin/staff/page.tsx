"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, Plus, UserCheck, UserRoundPlus, UsersRound } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { StaffForm, StaffList, useStaffStore, type Staff } from "@/features/staff";
import { useUserSalon } from "@/hooks/use-user-salon";

export default function AdminStaffPage() {
	const { salons, isLoading: salonsLoading } = useUserSalon();
	const { staff, fetchAllStaff, addStaff, updateStaff } = useStaffStore();
	const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

	useEffect(() => {
		void fetchAllStaff();
	}, [fetchAllStaff]);

	const assignedCount = staff.filter((member) => member.salonId).length;
	const specialties = useMemo(() => new Set(staff.map((member) => member.specialty).filter(Boolean)).size, [staff]);

	return (
		<ProtectedLayout>
			<RoleGuard allowedRoles={["owner"]}>
				<div className="space-y-7">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold"><UsersRound className="size-3.5" /> Workforce directory</div>
							<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Staff</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Manage staff accounts, specialties, and salon assignments across your portfolio.</p>
						</div>
						<Button size="lg" className="h-10 rounded-full px-4" onClick={() => { setEditingStaff(null); setShowForm(true); }}><Plus className="size-4" /> Add staff</Button>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<KpiCard icon={UsersRound} title="Total staff" value={staff.length} description="Workforce accounts" />
						<KpiCard icon={UserCheck} title="Assigned" value={assignedCount} description="Working at a salon" />
						<KpiCard icon={UserRoundPlus} title="Unassigned" value={staff.length - assignedCount} description="Ready for placement" />
						<KpiCard icon={BriefcaseBusiness} title="Specialties" value={specialties} description="Active skill categories" />
					</div>

					{!salonsLoading && salons.length === 0 && (
						<div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm">
							<Building2 className="mt-0.5 size-4 shrink-0 text-amber-600" />
							<div><p className="font-medium">No salons available for assignment</p><p className="mt-0.5 text-muted-foreground">You can create staff accounts now and assign them after adding a salon.</p></div>
						</div>
					)}

					<StaffList selectedSalonId={selectedSalonId} allStaff={staff} salons={salons} onSalonChange={setSelectedSalonId} onEdit={(member) => { setEditingStaff(member); setShowForm(true); }} onRefresh={() => fetchAllStaff()} />
				</div>

				<StaffForm
					open={showForm}
					onOpenChange={(open) => { setShowForm(open); if (!open) setEditingStaff(null); }}
					staff={editingStaff}
					onSubmit={editingStaff
						? (data) => updateStaff(editingStaff.id, { name: data.name, phone: data.phone, specialty: data.specialty || undefined })
						: (data) => addStaff({ name: data.name, email: data.email, password: data.password, phone: data.phone, specialty: data.specialty || undefined })}
				/>
			</RoleGuard>
		</ProtectedLayout>
	);
}
