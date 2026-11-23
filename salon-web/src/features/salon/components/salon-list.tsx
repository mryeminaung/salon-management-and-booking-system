"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Building2,
	Check,
	ChevronDown,
	Eye,
	EyeOff,
	MapPin,
	MoreHorizontal,
	Pencil,
	Phone,
	Plus,
	Search,
	Scissors,
	Star,
	Trash2,
	Users,
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

import { useSalonStore, type Salon } from "../hooks/use-salons";
import { SalonForm } from "./salon-form";

type StatusFilter = "all" | "published" | "hidden";

function initials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function SalonList() {
	const {
		salons,
		isLoading,
		error,
		fetchSalons,
		createSalon,
		updateSalon,
		deleteSalon,
	} = useSalonStore();
	const [showForm, setShowForm] = useState(false);
	const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
	const [deleteSalonItem, setDeleteSalonItem] = useState<Salon | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	useEffect(() => {
		void fetchSalons();
	}, [fetchSalons]);

	const filteredSalons = useMemo(() => {
		const query = search.trim().toLowerCase();
		return salons.filter((salon) => {
			const matchesSearch =
				!query ||
				salon.name.toLowerCase().includes(query) ||
				salon.phone.toLowerCase().includes(query) ||
				salon.address.toLowerCase().includes(query) ||
				salon.manager?.user.name.toLowerCase().includes(query);
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "published" && salon.isPublished) ||
				(statusFilter === "hidden" && !salon.isPublished);
			return matchesSearch && matchesStatus;
		});
	}, [salons, search, statusFilter]);

	const publishedCount = salons.filter((salon) => salon.isPublished).length;
	const totalStaff = salons.reduce((total, salon) => total + (salon._count?.staff ?? 0), 0);
	const totalServices = salons.reduce((total, salon) => total + (salon._count?.services ?? 0), 0);

	const openCreate = () => {
		setEditingSalon(null);
		setShowForm(true);
	};

	const openEdit = (salon: Salon) => {
		setEditingSalon(salon);
		setShowForm(true);
	};

	const handleDelete = async () => {
		if (!deleteSalonItem) return;
		setIsDeleting(true);
		try {
			await deleteSalon(deleteSalonItem.id);
			setDeleteSalonItem(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const columns: DataTableColumn<Salon>[] = [
		{
			id: "salon",
			header: "Salon",
			cell: (salon) => (
				<div className="flex min-w-64 items-center gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold">
						<Building2 className="size-5" />
					</span>
					<div className="min-w-0">
						<p className="truncate font-semibold">{salon.name}</p>
						<p className="mt-0.5 flex max-w-xs items-center gap-1 truncate text-xs text-muted-foreground">
							<MapPin className="size-3 shrink-0" /> {salon.address}
						</p>
					</div>
				</div>
			),
		},
		{
			id: "manager",
			header: "Manager",
			headerClassName: "hidden lg:table-cell",
			className: "hidden lg:table-cell",
			cell: (salon) =>
				salon.manager?.user ? (
					<div className="flex items-center gap-2.5">
						<span className="flex size-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
							{initials(salon.manager.user.name)}
						</span>
						<div>
							<p className="text-sm font-medium">{salon.manager.user.name}</p>
							<p className="text-xs text-muted-foreground">{salon.manager.user.email}</p>
						</div>
					</div>
				) : (
					<span className="text-sm text-muted-foreground">Not assigned</span>
				),
		},
		{
			id: "contact",
			header: "Contact",
			headerClassName: "hidden xl:table-cell",
			className: "hidden xl:table-cell",
			cell: (salon) => (
				<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
					<Phone className="size-3.5" /> {salon.phone}
				</span>
			),
		},
		{
			id: "team",
			header: "Team",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell",
			cell: (salon) => (
				<div className="flex items-center gap-4 text-sm">
					<span className="inline-flex items-center gap-1.5" title="Staff members">
						<Users className="size-4 text-muted-foreground" /> {salon._count?.staff ?? 0}
					</span>
					<span className="inline-flex items-center gap-1.5" title="Services">
						<Scissors className="size-4 text-muted-foreground" /> {salon._count?.services ?? 0}
					</span>
				</div>
			),
		},
		{
			id: "rating",
			header: "Rating",
			headerClassName: "hidden sm:table-cell",
			className: "hidden sm:table-cell",
			cell: (salon) => (
				<span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
					<Star className="size-4 fill-gold text-gold" /> {salon.rating.toFixed(1)}
				</span>
			),
		},
		{
			id: "status",
			header: "Status",
			cell: (salon) => (
				<span
					className={
						salon.isPublished
							? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
							: "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
					}>
					<span className={salon.isPublished ? "size-1.5 rounded-full bg-emerald-500" : "size-1.5 rounded-full bg-muted-foreground"} />
					{salon.isPublished ? "Published" : "Hidden"}
				</span>
			),
		},
		{
			id: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-16 text-right",
			className: "w-16 text-right",
			cell: (salon) => (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${salon.name}`}>
								<MoreHorizontal className="size-4" />
							</Button>
						}
					/>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuItem onClick={() => openEdit(salon)}>
							<Pencil className="size-4" /> Edit salon
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => void updateSalon(salon.id, { isPublished: !salon.isPublished })}>
							{salon.isPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							{salon.isPublished ? "Hide from booking" : "Publish salon"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setDeleteSalonItem(salon)}
							className="text-destructive focus:text-destructive">
							<Trash2 className="size-4" /> Delete salon
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	return (
		<div className="space-y-7">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
						<Building2 className="size-3.5" /> Salon portfolio
					</div>
					<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Salons</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						Manage every location, monitor team capacity, and control which salons clients can book.
					</p>
				</div>
				<Button size="lg" className="h-10 rounded-full px-4" onClick={openCreate}>
					<Plus className="size-4" /> Add salon
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard icon={Building2} title="Total salons" value={salons.length} description="Locations in your portfolio" />
				<KpiCard icon={Eye} title="Published" value={publishedCount} description="Visible to customers" />
				<KpiCard icon={Users} title="Total staff" value={totalStaff} description="Across every salon" />
				<KpiCard icon={Scissors} title="Total services" value={totalServices} description="Available menu items" />
			</div>

			<DataTableToolbar>
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search salons, locations, phones, or managers…"
						className="h-10 rounded-xl border-0 bg-background pl-9 shadow-none ring-1 ring-border/70"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />
						}>
						{statusFilter === "all" ? "Any status" : statusFilter === "published" ? "Published" : "Hidden"}
						<ChevronDown className="size-4 text-muted-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						{(["all", "published", "hidden"] as const).map((value) => (
							<DropdownMenuItem key={value} onClick={() => setStatusFilter(value)}>
								<span className="w-4">{statusFilter === value && <Check className="size-4" />}</span>
								<span className="capitalize">{value === "all" ? "Any status" : value}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</DataTableToolbar>

			{error && (
				<p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}

			<DataTable
				columns={columns}
				data={filteredSalons}
				getRowKey={(salon) => salon.id}
				ariaLabel="Salon portfolio"
				isLoading={isLoading}
				emptyTitle={salons.length === 0 ? "Create your first salon" : "No matching salons"}
				emptyDescription={
					salons.length === 0
						? "Add a location to start assigning managers, staff, and services."
						: "Try changing your search or status filter."
				}
			/>

			<SalonForm
				open={showForm}
				onOpenChange={(open) => {
					setShowForm(open);
					if (!open) setEditingSalon(null);
				}}
				salon={editingSalon}
				onSubmit={
					editingSalon
						? (data) => updateSalon(editingSalon.id, data)
						: createSalon
				}
			/>

			<AlertDialog
				open={deleteSalonItem !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteSalonItem(null);
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {deleteSalonItem?.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							This permanently removes the salon and disconnects its assigned resources. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep salon</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? "Deleting…" : "Delete salon"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
