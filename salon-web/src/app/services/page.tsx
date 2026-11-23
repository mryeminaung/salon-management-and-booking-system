"use client";

import { useState } from "react";
import { Building2, Sparkles } from "lucide-react";

import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import {
	ServiceForm,
	ServiceList,
	type Service,
	useServiceStore,
} from "@/features/service";
import { useUserSalon } from "@/hooks/use-user-salon";

export default function ServicesPage() {
	const { salonId, salons, isLoading } = useUserSalon();
	const { updateService } = useServiceStore();
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const salonName = salons.find((salon) => salon.id === salonId)?.name;

	return (
		<ProtectedLayout>
			<RoleGuard allowedRoles={["manager"]}>
				<div className="space-y-7">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
								<Sparkles className="size-3.5" /> Salon menu
							</div>
							<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Services</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								Review the services assigned to your salon and keep pricing, timing, and descriptions accurate.
							</p>
						</div>
						{salonName && (
							<div className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-border/70 bg-card/45 px-4 text-sm sm:self-auto">
								<Building2 className="size-4 text-gold" /> {salonName}
							</div>
						)}
					</div>

					{isLoading ? (
						<div className="h-64 animate-pulse rounded-2xl bg-muted/60" />
					) : salonId ? (
						<ServiceList
							salonId={salonId}
							onEdit={(service) => {
								setEditingService(service);
								setShowForm(true);
							}}
						/>
					) : (
						<div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
							<Building2 className="mx-auto size-8 text-muted-foreground" />
							<h2 className="mt-4 font-semibold">No salon assigned</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Ask the owner to assign your manager account to a salon.
							</p>
						</div>
					)}
				</div>

				<ServiceForm
					open={showForm}
					onOpenChange={(open) => {
						setShowForm(open);
						if (!open) setEditingService(null);
					}}
					service={editingService}
					onSubmit={(data) =>
						editingService ? updateService(editingService.id, data) : Promise.resolve()
					}
				/>
			</RoleGuard>
		</ProtectedLayout>
	);
}
