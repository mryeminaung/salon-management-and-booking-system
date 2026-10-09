"use client";

import { PageHeader } from "@/components/page-header";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CheckIcon,
	ChevronDownIcon,
	LinkIcon,
	PencilIcon,
	PlusIcon,
	SearchIcon,
	TrashIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useManagerStore, type Manager } from "../hooks/use-managers";
import { ManagerAssignDialog } from "./manager-assign-dialog";
import { ManagerForm } from "./manager-form";

export function ManagerList() {
	const {
		managers,
		isLoading,
		fetchManagers,
		createManager,
		updateManager,
		deleteManager,
	} = useManagerStore();
	const [showForm, setShowForm] = useState(false);
	const [editingManager, setEditingManager] = useState<Manager | null>(null);
	const [assignManagerId, setAssignManagerId] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [assignmentFilter, setAssignmentFilter] = useState("all");

	const assignmentOptions = [
		{ value: "all", label: "All" },
		{ value: "assigned", label: "Assigned" },
		{ value: "unassigned", label: "Unassigned" },
	];
	const selectedAssignment = assignmentOptions.find(
		(o) => o.value === assignmentFilter,
	);

	useEffect(() => {
		fetchManagers();
	}, [fetchManagers]);

	const filteredManagers = useMemo(() => {
		return managers.filter((manager) => {
			const matchesSearch =
				search === "" ||
				manager.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
				manager.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
				manager.user?.phone?.toLowerCase().includes(search.toLowerCase());
			const matchesAssignment =
				assignmentFilter === "all" ||
				(assignmentFilter === "assigned" && manager.salonId) ||
				(assignmentFilter === "unassigned" && !manager.salonId);
			return matchesSearch && matchesAssignment;
		});
	}, [managers, search, assignmentFilter]);

	const handleDelete = async () => {
		if (!deleteId) return;
		await deleteManager(deleteId);
		setDeleteId(null);
	};

	return (
		<div className="space-y-4">
			<PageHeader
				title="Managers"
				description="Create and assign managers to salons."
				action={
					<Button
						onClick={() => {
							setEditingManager(null);
							setShowForm(true);
						}}>
						<PlusIcon className="size-4" /> Add Manager
					</Button>
				}
			/>
			<Separator />

			<div className="flex items-center gap-3">
				<div className="relative flex-1 max-w-sm">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search managers..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5! text-sm font-medium hover:bg-muted shrink-0 hover:cursor-pointer" />
						}>
						{selectedAssignment?.label || "All"}
						<ChevronDownIcon className="size-4 text-muted-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-48">
						{assignmentOptions.map((option) => (
							<DropdownMenuItem
								key={option.value}
								onClick={() => setAssignmentFilter(option.value)}
								className="flex items-center gap-2">
								<span className="w-4">
									{assignmentFilter === option.value && (
										<CheckIcon className="size-4" />
									)}
								</span>
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{isLoading ? (
				<p className="text-muted-foreground">Loading...</p>
			) : filteredManagers.length === 0 ? (
				<p className="text-muted-foreground">
					{managers.length === 0
						? "No managers yet."
						: "No managers match your search."}
				</p>
			) : (
				<div className="rounded-lg border border-border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Assigned Salon</TableHead>
								<TableHead className="w-[120px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredManagers.map((manager) => (
								<TableRow key={manager.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarImage
													src="/avatars/user-1.webp"
													alt={manager.user?.name}
												/>
												<AvatarFallback className="text-xs">
													{manager.user?.name
														?.split(" ")
														.map((n: string) => n[0])
														.join("")
														.toUpperCase() || "???"}
												</AvatarFallback>
											</Avatar>
											<div className="grid gap-0.5">
												<span className="font-medium leading-none">
													{manager.user?.name || "—"}
												</span>
												<span className="text-xs text-muted-foreground">
													{manager.user?.email || "—"}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell>{manager.user?.phone || "—"}</TableCell>
									<TableCell className="capitalize">
										{manager.user?.role?.toLowerCase() || "manager"}
									</TableCell>
									<TableCell>{manager.salon?.name || "Unassigned"}</TableCell>
									<TableCell>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="icon-sm"
												title="Edit manager"
												onClick={() => {
													setEditingManager(manager);
													setShowForm(true);
												}}>
												<PencilIcon className="size-4" />
											</Button>
											{!manager.salonId ? (
												<Button
													variant="ghost"
													size="icon-sm"
													title="Assign to salon"
													onClick={() => setAssignManagerId(manager.id)}>
													<LinkIcon className="size-4" />
												</Button>
											) : (
												<Button
													variant="ghost"
													size="icon-sm"
													title="Reassign to salon"
													onClick={() => setAssignManagerId(manager.id)}>
													<LinkIcon className="size-4 text-muted-foreground" />
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon-sm"
												title="Delete manager"
												onClick={() => setDeleteId(manager.id)}>
												<TrashIcon className="size-4 text-destructive" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<ManagerForm
				open={showForm}
				onOpenChange={(open) => {
					setShowForm(open);
					if (!open) setEditingManager(null);
				}}
				manager={editingManager}
				onSubmit={
					editingManager
						? (data) => updateManager(editingManager.id, data)
						: createManager
				}
			/>

			<ManagerAssignDialog
				managerId={assignManagerId}
				onOpenChange={(open) => {
					if (!open) setAssignManagerId(null);
				}}
				onAssigned={() => {
					setAssignManagerId(null);
					fetchManagers();
				}}
			/>

			<AlertDialog
				open={deleteId !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteId(null);
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Manager</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this manager? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={handleDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
