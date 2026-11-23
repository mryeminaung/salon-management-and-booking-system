"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Check,
	ChevronDown,
	Clock3,
	DollarSign,
	Link2,
	MoreHorizontal,
	Pencil,
	Search,
	Sparkles,
	Trash2,
} from "lucide-react";

import { DataTable, DataTableToolbar, type DataTableColumn } from "@/components/data-table";
import { KpiCard } from "@/components/kpi-card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useServiceStore, type Service } from "../hooks/use-services";
import { ServiceAssignDialog } from "./service-assign-dialog";

interface ServiceListSalonProps {
	salonId: string;
	onEdit: (service: Service) => void;
}

interface ServiceListAdminProps {
	selectedSalonId: string | null;
	allServices: Service[];
	salons: { id: string; name: string }[];
	onSalonChange: (salonId: string | null) => void;
	onEdit: (service: Service) => void;
	onRefresh: () => void;
}

type ServiceListProps = ServiceListSalonProps | ServiceListAdminProps;
type AssignmentFilter = "all" | "assigned" | "unassigned";

function isAdminProps(props: ServiceListProps): props is ServiceListAdminProps {
	return "selectedSalonId" in props;
}

const money = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
});

function formatDuration(minutes: number) {
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;
	return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function ServiceList(props: ServiceListProps) {
	const {
		services: storeServices,
		isLoading,
		error,
		fetchSalonServices,
		deleteService,
	} = useServiceStore();
	const [search, setSearch] = useState("");
	const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");
	const [deleteServiceItem, setDeleteServiceItem] = useState<Service | null>(null);
	const [assignServiceId, setAssignServiceId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const adminMode = isAdminProps(props);
	const salonId = adminMode ? undefined : props.salonId;

	useEffect(() => {
		if (salonId) void fetchSalonServices(salonId);
	}, [salonId, fetchSalonServices]);

	const displayServices = useMemo(() => {
		if (!isAdminProps(props)) return storeServices;
		return props.selectedSalonId
			? props.allServices.filter((service) => service.salonId === props.selectedSalonId)
			: props.allServices;
	}, [props, storeServices]);

	const filteredServices = useMemo(() => {
		const query = search.trim().toLowerCase();
		return displayServices.filter((service) => {
			const matchesSearch =
				!query ||
				service.name.toLowerCase().includes(query) ||
				service.description?.toLowerCase().includes(query) ||
				service.salon?.name.toLowerCase().includes(query);
			const matchesAssignment =
				!adminMode ||
				assignmentFilter === "all" ||
				(assignmentFilter === "assigned" && Boolean(service.salonId)) ||
				(assignmentFilter === "unassigned" && !service.salonId);
			return matchesSearch && matchesAssignment;
		});
	}, [adminMode, assignmentFilter, displayServices, search]);

	const averagePrice =
		displayServices.length > 0
			? displayServices.reduce((total, service) => total + Number(service.price), 0) /
				displayServices.length
			: 0;
	const averageDuration =
		displayServices.length > 0
			? Math.round(
					displayServices.reduce((total, service) => total + service.duration, 0) /
						displayServices.length,
				)
			: 0;
	const assignedCount = displayServices.filter((service) => service.salonId).length;

	const selectedSalonName = isAdminProps(props)
		? props.salons.find((salon) => salon.id === props.selectedSalonId)?.name ?? "All salons"
		: "";

	const handleDelete = async () => {
		if (!deleteServiceItem) return;
		setIsDeleting(true);
		try {
			await deleteService(deleteServiceItem.id);
			setDeleteServiceItem(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const columns: DataTableColumn<Service>[] = [
		{
			id: "service",
			header: "Service",
			cell: (service) => (
				<div className="min-w-56">
					<div className="flex items-center gap-3">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold">
							<Sparkles className="size-5" />
						</span>
						<div>
							<p className="font-semibold">{service.name}</p>
							<p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
								{service.description || "No description added"}
							</p>
						</div>
					</div>
				</div>
			),
		},
		{
			id: "price",
			header: "Price",
			cell: (service) => <span className="font-medium tabular-nums">{money.format(Number(service.price))}</span>,
		},
		{
			id: "duration",
			header: "Duration",
			headerClassName: "hidden sm:table-cell",
			className: "hidden sm:table-cell",
			cell: (service) => (
				<span className="inline-flex items-center gap-1.5 text-muted-foreground">
					<Clock3 className="size-3.5" /> {formatDuration(service.duration)}
				</span>
			),
		},
		...(adminMode
			? [
					{
						id: "salon",
						header: "Salon",
						headerClassName: "hidden md:table-cell",
						className: "hidden md:table-cell",
						cell: (service: Service) =>
							service.salon?.name ? (
								<span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
									{service.salon.name}
								</span>
							) : (
								<span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
									Unassigned
								</span>
							),
					},
				] satisfies DataTableColumn<Service>[]
			: []),
		{
			id: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-16 text-right",
			className: "w-16 text-right",
			cell: (service) => (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${service.name}`}>
								<MoreHorizontal className="size-4" />
							</Button>
						}
					/>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuItem onClick={() => props.onEdit(service)}>
							<Pencil className="size-4" /> Edit service
						</DropdownMenuItem>
						{adminMode && !service.salonId && (
							<DropdownMenuItem onClick={() => setAssignServiceId(service.id)}>
								<Link2 className="size-4" /> Assign to salon
							</DropdownMenuItem>
						)}
						{adminMode && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setDeleteServiceItem(service)}
									className="text-destructive focus:text-destructive">
									<Trash2 className="size-4" /> Delete service
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	return (
		<div className="space-y-5">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					icon={Sparkles}
					title="Total services"
					value={displayServices.length}
					description="Across the current view"
				/>
				<KpiCard
					icon={DollarSign}
					title="Average price"
					value={money.format(averagePrice)}
					description="Mean price per service"
				/>
				<KpiCard
					icon={Clock3}
					title="Average duration"
					value={formatDuration(averageDuration)}
					description="Typical appointment length"
				/>
				<KpiCard
					icon={Link2}
					title={adminMode ? "Assigned to salons" : "Available in salon"}
					value={adminMode ? `${assignedCount} / ${displayServices.length}` : displayServices.length}
					description={adminMode ? "Services currently assigned" : "Services visible to clients"}
				/>
			</div>

			<DataTableToolbar>
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by service, description, or salon…"
						className="h-10 rounded-xl border-0 bg-background pl-9 shadow-none ring-1 ring-border/70"
					/>
				</div>

				{isAdminProps(props) && (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />
								}>
								{selectedSalonName} <ChevronDown className="size-4 text-muted-foreground" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52">
								<DropdownMenuItem onClick={() => props.onSalonChange(null)}>
									<span className="w-4">{props.selectedSalonId === null && <Check className="size-4" />}</span>
									All salons
								</DropdownMenuItem>
								{props.salons.map((salon) => (
									<DropdownMenuItem key={salon.id} onClick={() => props.onSalonChange(salon.id)}>
										<span className="w-4">{props.selectedSalonId === salon.id && <Check className="size-4" />}</span>
										{salon.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-36" />
								}>
								{assignmentFilter === "all"
									? "Any status"
									: assignmentFilter === "assigned"
										? "Assigned"
										: "Unassigned"}
								<ChevronDown className="size-4 text-muted-foreground" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								{(["all", "assigned", "unassigned"] as const).map((value) => (
									<DropdownMenuItem key={value} onClick={() => setAssignmentFilter(value)}>
										<span className="w-4">{assignmentFilter === value && <Check className="size-4" />}</span>
										<span className="capitalize">{value === "all" ? "Any status" : value}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</DataTableToolbar>

			{error && (
				<p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}

			<DataTable
				columns={columns}
				data={filteredServices}
				getRowKey={(service) => service.id}
				ariaLabel="Services"
				isLoading={isLoading}
				emptyTitle={displayServices.length === 0 ? "No services yet" : "No matching services"}
				emptyDescription={
					displayServices.length === 0
						? adminMode
							? "Create your first service to start building the salon menu."
							: "The salon owner has not assigned any services yet."
						: "Try adjusting your search or filters."
				}
			/>

			{isAdminProps(props) && (
				<ServiceAssignDialog
					serviceId={assignServiceId}
					onOpenChange={(open) => {
						if (!open) setAssignServiceId(null);
					}}
					onAssigned={() => {
						setAssignServiceId(null);
						props.onRefresh();
					}}
				/>
			)}

			<AlertDialog
				open={deleteServiceItem !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteServiceItem(null);
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {deleteServiceItem?.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							This permanently removes the service from your catalogue. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep service</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? "Deleting…" : "Delete service"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
