"use client";

import { useEffect, useMemo, useState } from "react";
import {
	BriefcaseBusiness,
	Building2,
	Check,
	ChevronDown,
	Link2,
	MoreHorizontal,
	Pencil,
	Phone,
	Search,
	Trash2,
} from "lucide-react";

import { DataTable, DataTableToolbar, type DataTableColumn } from "@/components/data-table";
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

import { useStaffStore, type Staff } from "../hooks/use-staff";
import { StaffAssignDialog } from "./staff-assign-dialog";

interface StaffListSalonProps {
	salonId: string;
	onEdit: (staff: Staff) => void;
}

interface StaffListAdminProps {
	selectedSalonId: string | null;
	allStaff: Staff[];
	salons: { id: string; name: string }[];
	onSalonChange: (salonId: string | null) => void;
	onEdit: (staff: Staff) => void;
	onRefresh: () => void;
}

type StaffListProps = StaffListSalonProps | StaffListAdminProps;
type AssignmentFilter = "all" | "assigned" | "unassigned";

function isAdminProps(props: StaffListProps): props is StaffListAdminProps {
	return "selectedSalonId" in props;
}

function initials(name: string) {
	return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
}

export function StaffList(props: StaffListProps) {
	const adminMode = isAdminProps(props);
	const { staff: storeStaff, isLoading, error, fetchSalonStaff, removeStaff } = useStaffStore();
	const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);
	const [assignStaff, setAssignStaff] = useState<Staff | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [search, setSearch] = useState("");
	const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");
	const [specialtyFilter, setSpecialtyFilter] = useState("all");

	const salonId = adminMode ? undefined : props.salonId;
	useEffect(() => {
		if (salonId) void fetchSalonStaff(salonId);
	}, [fetchSalonStaff, salonId]);

	const displayStaff = adminMode
		? props.selectedSalonId
			? props.allStaff.filter((staff) => staff.salonId === props.selectedSalonId)
			: props.allStaff
		: storeStaff;
	const specialties = useMemo(() => Array.from(new Set((adminMode ? props.allStaff : storeStaff).map((staff) => staff.specialty).filter((value): value is string => Boolean(value)))).sort(), [adminMode, props, storeStaff]);
	const filteredStaff = useMemo(() => {
		const query = search.trim().toLowerCase();
		return displayStaff.filter((staff) => {
			const matchesSearch = !query || staff.user?.name?.toLowerCase().includes(query) || staff.user?.email?.toLowerCase().includes(query) || staff.user?.phone?.toLowerCase().includes(query) || staff.specialty?.toLowerCase().includes(query) || staff.salon?.name?.toLowerCase().includes(query);
			const matchesAssignment = assignmentFilter === "all" || (assignmentFilter === "assigned" && Boolean(staff.salonId)) || (assignmentFilter === "unassigned" && !staff.salonId);
			const matchesSpecialty = specialtyFilter === "all" || staff.specialty === specialtyFilter;
			return matchesSearch && matchesAssignment && matchesSpecialty;
		});
	}, [assignmentFilter, displayStaff, search, specialtyFilter]);

	const handleDelete = async () => {
		if (!deleteStaff) return;
		setIsDeleting(true);
		try {
			await removeStaff(deleteStaff.id);
			setDeleteStaff(null);
			if (adminMode) props.onRefresh();
			else if (salonId) void fetchSalonStaff(salonId);
		} finally {
			setIsDeleting(false);
		}
	};

	const columns: DataTableColumn<Staff>[] = [
		{
			id: "staff",
			header: "Staff Member",
			cell: (staff) => (
				<div className="flex min-w-56 items-center gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-gold">{initials(staff.user?.name || "Staff")}</span>
					<div className="min-w-0"><p className="truncate font-semibold">{staff.user?.name || "Unnamed staff"}</p><p className="truncate text-xs text-muted-foreground">{staff.user?.email || "No email"}</p></div>
				</div>
			),
		},
		{
			id: "specialty",
			header: "Specialty",
			cell: (staff) => staff.specialty ? <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-gold"><BriefcaseBusiness className="size-3.5" /> {staff.specialty}</span> : <span className="text-sm text-muted-foreground">General</span>,
		},
		{
			id: "contact",
			header: "Contact",
			headerClassName: "hidden lg:table-cell",
			className: "hidden lg:table-cell",
			cell: (staff) => <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="size-3.5" /> {staff.user?.phone || "Not provided"}</span>,
		},
		...(adminMode ? [{
			id: "salon",
			header: "Assigned Salon",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell",
			cell: (staff: Staff) => staff.salon ? <span className="inline-flex items-center gap-2 text-sm font-medium"><Building2 className="size-4 text-gold" /> {staff.salon.name}</span> : <span className="text-sm text-muted-foreground">Not assigned</span>,
		}] : []),
		{
			id: "joined",
			header: "Joined",
			headerClassName: "hidden xl:table-cell",
			className: "hidden xl:table-cell text-sm text-muted-foreground",
			cell: (staff) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(staff.createdAt)),
		},
		{
			id: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-16 text-right",
			className: "w-16 text-right",
			cell: (staff) => (
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${staff.user?.name}`} />}><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem onClick={() => props.onEdit(staff)}><Pencil className="size-4" /> Edit staff</DropdownMenuItem>
						{adminMode && <DropdownMenuItem disabled={Boolean(staff.salonId)} onClick={() => setAssignStaff(staff)}><Link2 className="size-4" /> {staff.salonId ? "Already assigned" : "Assign to salon"}</DropdownMenuItem>}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => setDeleteStaff(staff)} className="text-destructive focus:text-destructive"><Trash2 className="size-4" /> Delete staff</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	return (
		<div className="space-y-4">
			<DataTableToolbar>
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search staff, specialties, or salons…" className="h-10 rounded-xl border-0 bg-background pl-9 shadow-none ring-1 ring-border/70" />
				</div>
				{adminMode && (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />}><span className="max-w-28 truncate">{props.selectedSalonId ? props.salons.find((salon) => salon.id === props.selectedSalonId)?.name : "All salons"}</span><ChevronDown className="size-4 text-muted-foreground" /></DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={() => props.onSalonChange(null)}><span className="w-4">{props.selectedSalonId === null && <Check className="size-4" />}</span>All salons</DropdownMenuItem>{props.salons.map((salon) => <DropdownMenuItem key={salon.id} onClick={() => props.onSalonChange(salon.id)}><span className="w-4">{props.selectedSalonId === salon.id && <Check className="size-4" />}</span>{salon.name}</DropdownMenuItem>)}</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />}>{assignmentFilter === "all" ? "Any assignment" : assignmentFilter === "assigned" ? "Assigned" : "Unassigned"}<ChevronDown className="size-4 text-muted-foreground" /></DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-44">{(["all", "assigned", "unassigned"] as const).map((value) => <DropdownMenuItem key={value} onClick={() => setAssignmentFilter(value)}><span className="w-4">{assignmentFilter === value && <Check className="size-4" />}</span>{value === "all" ? "Any assignment" : value === "assigned" ? "Assigned" : "Unassigned"}</DropdownMenuItem>)}</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted sm:min-w-40" />}><span className="max-w-28 truncate">{specialtyFilter === "all" ? "All specialties" : specialtyFilter}</span><ChevronDown className="size-4 text-muted-foreground" /></DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52"><DropdownMenuItem onClick={() => setSpecialtyFilter("all")}><span className="w-4">{specialtyFilter === "all" && <Check className="size-4" />}</span>All specialties</DropdownMenuItem>{specialties.map((specialty) => <DropdownMenuItem key={specialty} onClick={() => setSpecialtyFilter(specialty)}><span className="w-4">{specialtyFilter === specialty && <Check className="size-4" />}</span>{specialty}</DropdownMenuItem>)}</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</DataTableToolbar>

			{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}
			<DataTable columns={columns} data={filteredStaff} getRowKey={(staff) => staff.id} ariaLabel="Staff directory" isLoading={isLoading} emptyTitle={displayStaff.length === 0 ? "No staff members yet" : "No matching staff"} emptyDescription={displayStaff.length === 0 ? "Add a staff account to begin building your service team." : "Try changing your search or filters."} />

			{adminMode && <StaffAssignDialog staffId={assignStaff?.id ?? null} staffName={assignStaff?.user?.name} onOpenChange={(open) => { if (!open) setAssignStaff(null); }} onAssigned={() => { setAssignStaff(null); props.onRefresh(); }} />}
			<AlertDialog open={deleteStaff !== null} onOpenChange={(open) => { if (!open) setDeleteStaff(null); }}>
				<AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {deleteStaff?.user?.name}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the staff account, salon assignment, and login credentials. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep staff</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting…" : "Delete staff"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
