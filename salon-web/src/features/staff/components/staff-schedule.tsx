"use client";

import { useMemo, useState } from "react";
import {
	CalendarCheck2,
	Check,
	ChevronDown,
	Clock3,
	MapPin,
	Search,
	Sparkles,
	UserRound,
} from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/features/appointment/hooks/use-appointments";
import type { Appointment } from "@/features/appointment/types";
import { cn } from "cn";

type ScheduleView = "today" | "upcoming" | "past";
type StatusFilter = "all" | Appointment["status"];

const statusStyles: Record<Appointment["status"], string> = {
	pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
	confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
	completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	cancelled: "bg-muted text-muted-foreground",
};

function durationInMinutes(appointment: Appointment) {
	return Math.round((new Date(appointment.endAt).getTime() - new Date(appointment.startAt).getTime()) / 60_000);
}

function dateKey(value: string) {
	const date = new Date(value);
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function StaffSchedule() {
	const { appointments, isLoading, error, reload } = useAppointments();
	const [view, setView] = useState<ScheduleView>("today");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [search, setSearch] = useState("");
	const [now] = useState(() => new Date());
	const todayKey = dateKey(now.toISOString());
	const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
	const activeAppointments = appointments.filter((appointment) => appointment.status !== "cancelled");
	const todayCount = activeAppointments.filter((appointment) => dateKey(appointment.startAt) === todayKey).length;
	const upcomingCount = activeAppointments.filter((appointment) => new Date(appointment.startAt) > now && ["pending", "confirmed"].includes(appointment.status)).length;
	const weekCount = activeAppointments.filter((appointment) => { const start = new Date(appointment.startAt); return start >= now && start <= weekEnd; }).length;
	const completedCount = appointments.filter((appointment) => appointment.status === "completed").length;

	const visibleAppointments = useMemo(() => {
		const query = search.trim().toLowerCase();
		return appointments
			.filter((appointment) => {
				const start = new Date(appointment.startAt);
				const isToday = dateKey(appointment.startAt) === todayKey;
				const matchesView = view === "today"
					? isToday
					: view === "upcoming"
						? !isToday && start > now && ["pending", "confirmed"].includes(appointment.status)
						: start < now || ["completed", "cancelled"].includes(appointment.status);
				const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
				const matchesSearch = !query || appointment.serviceName.toLowerCase().includes(query) || appointment.salonName.toLowerCase().includes(query) || appointment.customer?.user.name.toLowerCase().includes(query);
				return matchesView && matchesStatus && matchesSearch;
			})
			.sort((a, b) => view === "past" ? new Date(b.startAt).getTime() - new Date(a.startAt).getTime() : new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
	}, [appointments, now, search, statusFilter, todayKey, view]);

	const groupedAppointments = useMemo(() => {
		return visibleAppointments.reduce<Record<string, Appointment[]>>((groups, appointment) => {
			const key = dateKey(appointment.startAt);
			(groups[key] ??= []).push(appointment);
			return groups;
		}, {});
	}, [visibleAppointments]);

	return (
		<div className="space-y-7">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold"><CalendarCheck2 className="size-3.5" /> Personal schedule</div>
					<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">My schedule</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Review your assigned appointments, client details, and daily workload.</p>
				</div>
				<Button variant="outline" className="h-10 rounded-full" onClick={() => void reload()}>Refresh schedule</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard icon={CalendarCheck2} title="Today" value={isLoading ? "…" : todayCount} description="Appointments on your schedule" />
				<KpiCard icon={Clock3} title="Upcoming" value={isLoading ? "…" : upcomingCount} description="Future active bookings" />
				<KpiCard icon={Sparkles} title="Next 7 days" value={isLoading ? "…" : weekCount} description="Appointments this week" />
				<KpiCard icon={Check} title="Completed" value={isLoading ? "…" : completedCount} description="Finished appointments" />
			</div>

			<div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/35 p-3 lg:flex-row lg:items-center">
				<div className="flex rounded-xl bg-muted/70 p-1">
					{(["today", "upcoming", "past"] as const).map((item) => <button key={item} type="button" onClick={() => setView(item)} className={cn("flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors lg:flex-none", view === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{item}</button>)}
				</div>
				<div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers or services…" className="h-10 rounded-xl border-0 bg-background pl-9 shadow-none ring-1 ring-border/70" /></div>
				<DropdownMenu>
					<DropdownMenuTrigger render={<button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl bg-background px-3 text-sm font-medium ring-1 ring-border/70 transition-colors hover:bg-muted lg:min-w-40" />}>{statusFilter === "all" ? "Any status" : statusFilter}<ChevronDown className="size-4 text-muted-foreground" /></DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">{(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}><span className="w-4">{statusFilter === status && <Check className="size-4" />}</span><span className="capitalize">{status === "all" ? "Any status" : status}</span></DropdownMenuItem>)}</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}
			{isLoading ? (
				<div className="space-y-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32 w-full rounded-2xl" />)}</div>
			) : visibleAppointments.length === 0 ? (
				<div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 px-6 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-gold"><CalendarCheck2 className="size-5" /></span><h2 className="mt-4 text-base font-semibold">No appointments here</h2><p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Your {view} schedule is clear, or the current filters have no matches.</p></div>
			) : (
				<div className="space-y-7">
					{Object.entries(groupedAppointments).map(([key, group]) => {
						const groupDate = new Date(group[0].startAt);
						return <section key={key} className="space-y-3"><div className="flex items-center gap-3"><h2 className="text-sm font-semibold">{groupDate.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</h2><span className="h-px flex-1 bg-border/70" /><span className="text-xs text-muted-foreground">{group.length} appointment{group.length === 1 ? "" : "s"}</span></div><div className="space-y-3">{group.map((appointment) => {
							const start = new Date(appointment.startAt);
							const end = new Date(appointment.endAt);
							const isCurrent = start <= now && end >= now && appointment.status !== "cancelled";
							return <Card key={appointment.id} className={cn("gap-0 py-0", isCurrent && "ring-gold/45")}><div className="grid sm:grid-cols-[7rem_1fr]"><div className="flex items-center justify-between border-b border-border/60 bg-muted/25 px-4 py-4 sm:block sm:border-b-0 sm:border-r"><p className="text-lg font-semibold tabular-nums">{start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p><p className="text-xs text-muted-foreground">{durationInMinutes(appointment)} min</p>{isCurrent && <span className="mt-3 hidden items-center gap-1.5 text-xs font-semibold text-gold sm:inline-flex"><span className="size-1.5 rounded-full bg-gold" /> In progress</span>}</div><div className="p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{appointment.serviceName}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><UserRound className="size-4 text-gold" /> {appointment.customer?.user.name || "Customer"}{appointment.customer?.user.phone ? ` · ${appointment.customer.user.phone}` : ""}</p></div><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[appointment.status])}>{appointment.status}</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {appointment.salonName}</span><span>{start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}–{end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span><span>${Number(appointment.price).toLocaleString()}</span></div>{appointment.notes && <p className="mt-3 rounded-lg bg-muted/45 px-3 py-2 text-xs leading-5"><span className="font-semibold">Client note:</span> {appointment.notes}</p>}</div></div></Card>;
						})}</div></section>;
					})}
				</div>
			)}
		</div>
	);
}
