"use client";

import Link from "next/link";
import { Calendar, CalendarCheck2, CheckCircle2, Clock3, MapPin, Sparkles, UserCheck, UserRound } from "lucide-react";

import { DashboardQuickActions, type DashboardQuickAction } from "@/components/dashboard-quick-actions";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment } from "@/features/appointment/types";
import { useAuthStore } from "@/stores/auth-store";

import { useStaffProfile } from "../hooks/use-staff-profile";

const actions: DashboardQuickAction[] = [
	{ label: "My schedule", description: "Review today and upcoming work", href: "/schedule", icon: Calendar },
	{ label: "My profile", description: "Update account and security", href: "/profile", icon: UserCheck },
];

function durationInMinutes(appointment: Appointment) {
	return Math.round((new Date(appointment.endAt).getTime() - new Date(appointment.startAt).getTime()) / 60_000);
}

export function StaffDashboard({ appointments, isLoading, error }: { appointments: Appointment[]; isLoading: boolean; error: string }) {
	const user = useAuthStore((state) => state.user);
	const { profile, isLoading: profileLoading, error: profileError } = useStaffProfile();
	const now = new Date();
	const today = now.toDateString();
	const active = appointments.filter((appointment) => appointment.status !== "cancelled");
	const todayAppointments = active.filter((appointment) => new Date(appointment.startAt).toDateString() === today).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
	const upcomingAppointments = active.filter((appointment) => new Date(appointment.startAt) > now && ["pending", "confirmed"].includes(appointment.status));
	const completedThisMonth = appointments.filter((appointment) => { const start = new Date(appointment.startAt); return appointment.status === "completed" && start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear(); }).length;
	const bookedMinutes = todayAppointments.reduce((total, appointment) => total + durationInMinutes(appointment), 0);
	const nextAppointment = upcomingAppointments.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold"><Sparkles className="size-3.5" /> Staff workspace</div>
					<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Welcome back, {user?.name?.split(" ")[0]}</h1>
					<p className="mt-2 text-sm text-muted-foreground sm:text-base">{profile?.salon ? `${profile.salon.name} · ${profile.specialty || "Salon staff"}` : "Your personal schedule and account overview"}</p>
				</div>
				<Button nativeButton={false} render={<Link href="/schedule" />} className="h-10 rounded-full px-4"><Calendar className="size-4" /> Open schedule</Button>
			</div>

			{!profileLoading && !profile?.salon && !profileError && <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-amber-600" /><div><p className="font-medium">No salon assignment yet</p><p className="mt-0.5 text-muted-foreground">Your manager or owner needs to assign you before appointments can appear.</p></div></div>}
			{(error || profileError) && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error || profileError}</p>}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard icon={CalendarCheck2} title="Today" value={isLoading ? "…" : todayAppointments.length} description="Scheduled appointments" />
				<KpiCard icon={Clock3} title="Upcoming" value={isLoading ? "…" : upcomingAppointments.length} description="Future active bookings" />
				<KpiCard icon={CheckCircle2} title="Completed" value={isLoading ? "…" : completedThisMonth} description="Finished this month" />
				<KpiCard icon={Sparkles} title="Booked time" value={isLoading ? "…" : `${bookedMinutes}m`} description="Scheduled today" />
			</div>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
				<Card className="relative overflow-hidden ring-gold/20">
					<div className="absolute inset-x-0 top-0 h-1 bg-gold" />
					<CardHeader><CardTitle className="flex items-center gap-2 text-base font-semibold"><Clock3 className="size-5 text-gold" /> Next appointment</CardTitle></CardHeader>
					<CardContent>
						{isLoading ? <Skeleton className="h-32 w-full rounded-xl" /> : nextAppointment ? <div className="rounded-xl bg-muted/35 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-2xl font-semibold tabular-nums">{new Date(nextAppointment.startAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(nextAppointment.startAt).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-gold">{nextAppointment.status}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Service</p><p className="mt-0.5 font-semibold">{nextAppointment.serviceName}</p></div><div><p className="text-xs text-muted-foreground">Customer</p><p className="mt-0.5 flex items-center gap-1.5 font-semibold"><UserRound className="size-4 text-gold" /> {nextAppointment.customer?.user.name || "Customer"}</p></div><div><p className="text-xs text-muted-foreground">Duration</p><p className="mt-0.5 text-sm font-medium">{durationInMinutes(nextAppointment)} minutes</p></div><div><p className="text-xs text-muted-foreground">Location</p><p className="mt-0.5 text-sm font-medium">{nextAppointment.salonName}</p></div></div></div> : <div className="flex min-h-32 flex-col items-center justify-center text-center"><span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-gold"><CalendarCheck2 className="size-4" /></span><p className="mt-3 text-sm font-semibold">No upcoming appointments</p><p className="mt-1 text-xs text-muted-foreground">Your schedule is currently clear.</p></div>}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="text-base font-semibold">Today’s timeline</CardTitle><p className="mt-1 text-sm text-muted-foreground">Your current shift at a glance</p></div><Button nativeButton={false} render={<Link href="/schedule" />} variant="ghost" size="sm">View all</Button></CardHeader>
					<CardContent>
						{isLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div> : todayAppointments.length > 0 ? <div className="space-y-1">{todayAppointments.slice(0, 5).map((appointment) => <div key={appointment.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted/45"><span className="w-16 shrink-0 text-sm font-semibold tabular-nums">{new Date(appointment.startAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span><span className="h-8 w-px bg-gold/40" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{appointment.serviceName}</p><p className="truncate text-xs text-muted-foreground">{appointment.customer?.user.name || "Customer"}</p></div><span className="text-xs text-muted-foreground">{durationInMinutes(appointment)}m</span></div>)}</div> : <div className="flex min-h-32 flex-col items-center justify-center text-center"><p className="text-sm font-semibold">Nothing scheduled today</p><p className="mt-1 text-xs text-muted-foreground">Enjoy the open time in your shift.</p></div>}
					</CardContent>
				</Card>
			</div>

			<DashboardQuickActions actions={actions} />
		</div>
	);
}
