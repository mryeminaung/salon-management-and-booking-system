"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";

import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import {
	ServiceForm,
	ServiceList,
	type Service,
	useServiceStore,
} from "@/features/service";
import { useUserSalon } from "@/hooks/use-user-salon";

export default function AdminServicesPage() {
	const { salons } = useUserSalon();
	const { services, fetchAllServices, createService, updateService } = useServiceStore();
	const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);

	useEffect(() => {
		void fetchAllServices();
	}, [fetchAllServices]);

	return (
		<ProtectedLayout>
			<RoleGuard allowedRoles={["owner"]}>
				<div className="space-y-7">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
								<Sparkles className="size-3.5" /> Service catalogue
							</div>
							<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Services</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								Create your service menu, compare pricing, and assign each offering to the right salon.
							</p>
						</div>
						<Button
							size="lg"
							className="h-10 rounded-full px-4"
							onClick={() => {
								setEditingService(null);
								setShowForm(true);
							}}>
							<Plus className="size-4" /> Add service
						</Button>
					</div>

					<ServiceList
						selectedSalonId={selectedSalonId}
						allServices={services}
						salons={salons.map((salon) => ({ id: salon.id, name: salon.name }))}
						onSalonChange={setSelectedSalonId}
						onEdit={(service) => {
							setEditingService(service);
							setShowForm(true);
						}}
						onRefresh={() => void fetchAllServices()}
					/>
				</div>

				<ServiceForm
					open={showForm}
					onOpenChange={(open) => {
						setShowForm(open);
						if (!open) setEditingService(null);
					}}
					service={editingService}
					onSubmit={
						editingService
							? (data) => updateService(editingService.id, data)
							: createService
					}
				/>
			</RoleGuard>
		</ProtectedLayout>
	);
}
