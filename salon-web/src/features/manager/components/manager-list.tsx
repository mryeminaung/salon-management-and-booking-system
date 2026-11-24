"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Building2,
	Check,
	ChevronDown,
	Link2,
	MoreHorizontal,
	Pencil,
	Phone,
	Plus,
	Search,
	Trash2,
	UserCheck,
	UserRoundCog,
	UsersRound,
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
import { useSalonStore } from "@/features/salon";

import { useManagerStore, type Manager } from "../hooks/use-managers";
import { ManagerAssignDialog } from "./manager-assign-dialog";
import { ManagerForm } from "./manager-form";

type AssignmentFilter = "all" | "assigned" | "unassigned";

function initials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function ManagerList() {
	const { managers, isLoading, error, fetchManagers, createManager, updateManager, deleteManager } = useManagerStore();
	const { salons, fetchSalons } = useSalonStore();
	const [showForm, setShowForm] = useState(false);
	const [editingManager, setEditingManager] = useState<Manager | null>(null);
	const [assignManager, setAssignManager] = useState<Manager | null>(null);
	const [deleteManagerItem, setDeleteManagerItem] = useState<Manager | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [search, setSearch] = useState("");
	const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");
	const [salonFilter, setSalonFilter] = useState("all");

	useEffect(() => {
		void Promise.all([fetchManagers(), fetchSalons()]);
	}, [fetchManagers, fetchSalons]);

	const filteredManagers = useMemo(() => {
		const query = search.trim().toLowerCase();
		return managers.filter((manager) => {
			const matchesSearch =
				!query ||
				manager.user?.name?.toLowerCase().includes(query) ||
				manager.user?.email?.toLowerCase().includes(query) ||
				manager.user?.phone?.toLowerCase().includes(query) ||
				manager.salon?.name?.toLowerCase().includes(query);
			const matchesAssignment =
				assignmentFilter === "all" ||
				(assignmentFilter === "assigned" && Boolean(manager.salonId)) ||
				(assignmentFilter === "unassigned" && !manager.salonId);
			const matchesSalon = salonFilter === "all" || manager.salonId === salonFilter;
			return matchesSearch && matchesAssignment && matchesSalon;
		});
	}, [assignmentFilter, managers, salonFilter, search]);

	const assignedCount = managers.filter((manager) => manager.salonId).length;
	const unassignedCount = managers.length - assignedCount;
	const coverage = salons.length > 0 ? Math.round((assignedCount / salons.length) * 100) : 0;

	const openCreate = () => {
		setEditingManager(null);
		setShowForm(true);
	};

	const handleDelete = async () => {
		if (!deleteManagerItem) return;
		setIsDeleting(true);
		try {
			await deleteManager(deleteManagerItem.id);
			setDeleteManagerItem(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const columns: DataTableColumn<Manager>[] = [
		{
			id: "manager",
			header: "Manager",
			cell: (manager) => (
				<div className="flex min-w-56 items-center gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-gold">
						{initials(manager.user?.name || "Manager")}
					</span>
					<div className="min-w-0">
						<p className="truncate font-semibold">{manager.user?.name || "Unnamed manager"}</p>
						<p className="truncate text-xs text-muted-foreground">{manager.user?.email || "No email"}</p>
					</div>
				</div>
			),
		},
		{
			id: "contact",
			header: "Contact",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell",
			cell: (manager) => (
				<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
					<Phone className="size-3.5" /> {manager.user?.phone || "Not provided"}
				</span>
			),
		},
		{
			id: "salon",
			header: "Assigned Salon",
			headerClassName: "hidden sm:table-cell",
			className: "hidden sm:table-cell",
			cell: (manager) => manager.salon ? (
				<span className="inline-flex items-center gap-2 text-sm font-medium">
					<Building2 className="size-4 text-gold" /> {manager.salon.name}
				</span>
			) : <span className="text-sm text-muted-foreground">Not assigned</span>,
		},
		{
			id: "status",
			header: "Status",
			cell: (manager) => (
				<span className={manager.salonId
					? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
					: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"}>
					<span className={manager.salonId ? "size-1.5 rounded-full bg-emerald-500" : "size-1.5 rounded-full bg-amber-500"} />
					{manager.salonId ? "Assigned" : "Unassigned"}
				</span>
			),
		},
		{
			id: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-16 text-right",
			className: "w-16 text-right",
			cell: (manager) => (
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${manager.user?.name}`} />}>
						<MoreHorizontal className="size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-52">
						<DropdownMenuItem onClick={() => { setEditingManager(manager); setShowForm(true); }}>
							<Pencil className="size-4" /> Edit contact
						</DropdownMenuItem>
						<DropdownMenuItem disabled={Boolean(manager.salonId)} onClick={() => setAssignManager(manager)}>
							<Link2 className="size-4" /> {manager.salonId ? "Already assigned" : "Assign to salon"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={Boolean(manager.salonId)}
							onClick={() => setDeleteManagerItem(manager)}
							className="text-destructive focus:text-destructive">
							<Trash2 className="size-4" /> {manager.salonId ? "Unassign before deleting" : "Delete manager"}
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
						<UserRoundCog className="size-3.5" /> Team leadership
					</div>
					<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Managers</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						Create manager accounts, monitor salon coverage, and assign leadership to open locations.
					</p>
				</div>
				<Button size="lg" className="h-10 rounded-full px-4" onClick={openCreate}>
					<Plus className="size-4" /> Add manager
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard icon={UsersRound} title="Total managers" value={managers.length} description="Leadership accounts" />
				<KpiCard icon={UserCheck} title="Assigned" value={assignedCount} description="Leading a salon" />
				<KpiCard icon={UserRoundCog} title="Unassigned" value={unassignedCount} description="Available for placement" />
				<KpiCard icon={Building2} title="Salon coverage" value={`${coverage}%`} description={`${assignedCount} of ${salons.length} locations`} />
			</div>

			<DataTableToolbar>
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search managers, salons, or contact details…" className="h-10 rounded-xl border-0 bg-background pl-9 shadow-none ring-1 ring-border/70" />
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />}>
						{assignmentFilter === "all" ? "Any assignment" : assignmentFilter === "assigned" ? "Assigned" : "Unassigned"}
						<ChevronDown className="size-4 text-muted-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						{(["all", "assigned", "unassigned"] as const).map((value) => (
							<DropdownMenuItem key={value} onClick={() => setAssignmentFilter(value)}>
								<span className="w-4">{assignmentFilter === value && <Check className="size-4" />}</span>
								{value === "all" ? "Any assignment" : value === "assigned" ? "Assigned" : "Unassigned"}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-44" />}>
						<span className="max-w-32 truncate">{salonFilter === "all" ? "All salons" : salons.find((salon) => salon.id === salonFilter)?.name}</span>
						<ChevronDown className="size-4 text-muted-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-52">
						<DropdownMenuItem onClick={() => setSalonFilter("all")}><span className="w-4">{salonFilter === "all" && <Check className="size-4" />}</span>All salons</DropdownMenuItem>
						{salons.map((salon) => <DropdownMenuItem key={salon.id} onClick={() => setSalonFilter(salon.id)}><span className="w-4">{salonFilter === salon.id && <Check className="size-4" />}</span>{salon.name}</DropdownMenuItem>)}
					</DropdownMenuContent>
				</DropdownMenu>
			</DataTableToolbar>

			{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}

			<DataTable
				columns={columns}
				data={filteredManagers}
				getRowKey={(manager) => manager.id}
				ariaLabel="Managers"
				isLoading={isLoading}
				emptyTitle={managers.length === 0 ? "Create your first manager" : "No matching managers"}
				emptyDescription={managers.length === 0 ? "Add a manager account, then assign it to an available salon." : "Try changing your search or filters."}
			/>

			<ManagerForm
				open={showForm}
				onOpenChange={(open) => { setShowForm(open); if (!open) setEditingManager(null); }}
				manager={editingManager}
				onSubmit={editingManager
					? (data) => updateManager(editingManager.id, { phone: data.phone, address: data.address })
					: (data) => createManager({ name: data.name, email: data.email, password: data.password, phone: data.phone })}
			/>
			<ManagerAssignDialog managerId={assignManager?.id ?? null} managerName={assignManager?.user?.name} onOpenChange={(open) => { if (!open) setAssignManager(null); }} onAssigned={() => setAssignManager(null)} />

			<AlertDialog open={deleteManagerItem !== null} onOpenChange={(open) => { if (!open) setDeleteManagerItem(null); }}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {deleteManagerItem?.user?.name}?</AlertDialogTitle>
						<AlertDialogDescription>This permanently removes the manager account and login credentials. This action cannot be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep manager</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting…" : "Delete manager"}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
