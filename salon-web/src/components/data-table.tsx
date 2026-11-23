import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
	id: string;
	header: ReactNode;
	cell: (row: T) => ReactNode;
	className?: string;
	headerClassName?: string;
}

interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	data: T[];
	getRowKey: (row: T) => string;
	ariaLabel: string;
	isLoading?: boolean;
	emptyTitle?: string;
	emptyDescription?: string;
	rowClassName?: (row: T) => string | undefined;
}

export function DataTable<T>({
	columns,
	data,
	getRowKey,
	ariaLabel,
	isLoading = false,
	emptyTitle = "Nothing here yet",
	emptyDescription = "Data will appear here when it becomes available.",
	rowClassName,
}: DataTableProps<T>) {
	return (
		<div className="overflow-hidden rounded-2xl border border-border/70 bg-card/45 shadow-sm">
			<Table aria-label={ariaLabel}>
				<TableHeader className="bg-muted/45">
					<TableRow className="hover:bg-transparent">
						{columns.map((column) => (
							<TableHead
								key={column.id}
								className={cn(
									"h-11 text-sm font-semibold capitalize tracking-normal text-foreground",
									column.headerClassName,
								)}>
								{column.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading
						? Array.from({ length: 5 }).map((_, rowIndex) => (
							<TableRow key={rowIndex} className="hover:bg-transparent">
								{columns.map((column, columnIndex) => (
									<TableCell key={column.id} className={column.className}>
										<Skeleton className={cn("h-4", columnIndex === 0 ? "w-40" : "w-24")} />
									</TableCell>
								))}
							</TableRow>
						))
						: data.map((row) => (
							<TableRow key={getRowKey(row)} className={cn("group", rowClassName?.(row))}>
								{columns.map((column) => (
									<TableCell key={column.id} className={column.className}>
										{column.cell(row)}
									</TableCell>
								))}
							</TableRow>
						))}
				</TableBody>
			</Table>

			{!isLoading && data.length === 0 && (
				<div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
					<span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<Inbox className="size-5" />
					</span>
					<h3 className="mt-4 text-sm font-semibold">{emptyTitle}</h3>
					<p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
				</div>
			)}
		</div>
	);
}

export function DataTableToolbar({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/35 p-3 sm:flex-row sm:items-center",
				className,
			)}>
			{children}
		</div>
	);
}
