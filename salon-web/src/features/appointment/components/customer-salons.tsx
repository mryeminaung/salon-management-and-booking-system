"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowRight,
	CalendarDays,
	Check,
	Clock3,
	MapPin,
	Search,
	Scissors,
	Sparkles,
	Star,
	Users,
} from "lucide-react";

import { DataTable, DataTableToolbar, type DataTableColumn } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

import { apiError, type BookableSalon, type SalonDetails } from "../types";

type BookableService = SalonDetails["services"][number];

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

export function CustomerSalons() {
	const router = useRouter();
	const [salons, setSalons] = useState<BookableSalon[]>([]);
	const [salonSearch, setSalonSearch] = useState("");
	const [serviceSearch, setServiceSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [details, setDetails] = useState<SalonDetails | null>(null);
	const [serviceId, setServiceId] = useState("");
	const [staffId, setStaffId] = useState("");
	const [date, setDate] = useState("");
	const [slot, setSlot] = useState("");
	const [slots, setSlots] = useState<string[]>([]);
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(true);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		api
			.get<{ data: BookableSalon[] }>("/api/appointments/bookable-salons")
			.then((response) => setSalons(response.data.data))
			.catch((requestError) => setError(apiError(requestError, "Could not load salons")))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!selectedId) return;
		let current = true;
		api
			.get<{ data: SalonDetails }>(`/api/appointments/bookable-salons/${selectedId}`)
			.then((response) => {
				if (current) setDetails(response.data.data);
			})
			.catch((requestError) => {
				if (current) setError(apiError(requestError, "Could not load salon"));
			});
		return () => {
			current = false;
		};
	}, [selectedId]);

	useEffect(() => {
		if (!selectedId || !serviceId || !staffId || !date) return;
		let current = true;
		const loadAvailability = async () => {
			setLoadingSlots(true);
			const timezoneOffset = new Date(`${date}T12:00:00`).getTimezoneOffset();
			try {
				const response = await api.get<{ data: string[] }>(
					`/api/appointments/bookable-salons/${selectedId}/availability`,
					{ params: { serviceId, staffId, date, timezoneOffset } },
				);
				if (current) setSlots(response.data.data);
			} catch (requestError) {
				if (current) setError(apiError(requestError, "Could not load available times"));
			} finally {
				if (current) setLoadingSlots(false);
			}
		};
		void loadAvailability();
		return () => {
			current = false;
		};
	}, [selectedId, serviceId, staffId, date]);

	const filteredSalons = useMemo(() => {
		const query = salonSearch.trim().toLowerCase();
		return salons.filter(
			(salon) =>
				!query ||
				salon.name.toLowerCase().includes(query) ||
				salon.address.toLowerCase().includes(query) ||
				salon.description.toLowerCase().includes(query),
		);
	}, [salonSearch, salons]);

	const filteredServices = useMemo(() => {
		const query = serviceSearch.trim().toLowerCase();
		return (details?.services ?? []).filter(
			(service) =>
				!query ||
				service.name.toLowerCase().includes(query) ||
				service.description?.toLowerCase().includes(query),
		);
	}, [details, serviceSearch]);

	const selectedService = details?.services.find((service) => service.id === serviceId);

	const resetAvailability = () => {
		setSlot("");
		setSlots([]);
		setError("");
	};

	const openServices = (id: string) => {
		setDetails(null);
		setServiceSearch("");
		setServiceId("");
		setStaffId("");
		setDate("");
		setSlot("");
		setSlots([]);
		setNotes("");
		setError("");
		setSelectedId(id);
	};

	const selectService = (id: string) => {
		setServiceId(id);
		resetAvailability();
	};

	const closeDialog = () => {
		setSelectedId(null);
		setDetails(null);
		setError("");
	};

	const book = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!selectedId || !serviceId || !staffId || !slot || !date) return;
		setSaving(true);
		setError("");
		try {
			await api.post("/api/appointments", {
				salonId: selectedId,
				serviceId,
				staffId,
				startAt: slot,
				timezoneOffset: new Date(`${date}T12:00:00`).getTimezoneOffset(),
				notes,
			});
			closeDialog();
			router.push("/appointments");
		} catch (requestError) {
			setError(apiError(requestError, "Could not book appointment"));
			setSlot("");
			setSlots((current) => current.filter((time) => time !== slot));
		} finally {
			setSaving(false);
		}
	};

	const today = new Date();
	const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
		today.getDate(),
	).padStart(2, "0")}`;
	const latest = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
	const maxDate = `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, "0")}-${String(
		latest.getDate(),
	).padStart(2, "0")}`;

	const serviceColumns: DataTableColumn<BookableService>[] = [
		{
			id: "service",
			header: "Service",
			cell: (service) => (
				<div className="min-w-52">
					<p className="font-semibold">{service.name}</p>
					<p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
						{service.description || "A salon service tailored to your appointment."}
					</p>
				</div>
			),
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
		{
			id: "price",
			header: "Price",
			cell: (service) => <span className="font-semibold tabular-nums">{money.format(Number(service.price))}</span>,
		},
		{
			id: "select",
			header: <span className="sr-only">Select</span>,
			headerClassName: "w-28",
			className: "w-28 text-right",
			cell: (service) => (
				<Button
					type="button"
					variant={service.id === serviceId ? "default" : "outline"}
					size="sm"
					className="rounded-full"
					onClick={() => selectService(service.id)}>
					{service.id === serviceId ? <Check className="size-3.5" /> : null}
					{service.id === serviceId ? "Selected" : "Choose"}
				</Button>
			),
		},
	];

	return (
		<div className="space-y-7">
			<div>
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
					<Sparkles className="size-3.5" /> Discover
				</div>
				<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Find your next salon</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
					Compare service menus, choose your professional, and reserve a time that works for you.
				</p>
			</div>

			<div className="relative max-w-xl">
				<Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={salonSearch}
					onChange={(event) => setSalonSearch(event.target.value)}
					placeholder="Search salons or locations…"
					className="h-11 rounded-xl pl-10"
				/>
			</div>

			{error && !selectedId && (
				<p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}

			{loading ? (
				<div className="grid gap-4 md:grid-cols-2">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className="h-72 animate-pulse rounded-2xl bg-muted/60" />
					))}
				</div>
			) : filteredSalons.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-border p-12 text-center">
					<Scissors className="mx-auto size-7 text-muted-foreground" />
					<h2 className="mt-4 font-semibold">{salons.length ? "No salons match your search" : "No salons available yet"}</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{salons.length ? "Try another salon name or location." : "Check back soon for new booking options."}
					</p>
				</div>
			) : (
				<div className="grid gap-5 md:grid-cols-2">
					{filteredSalons.map((salon) => (
						<Card key={salon.id} className="group overflow-hidden rounded-2xl border-border/70 bg-card/50 transition-all hover:-translate-y-0.5 hover:shadow-lg">
							<CardContent className="flex h-full flex-col p-6">
								<div className="flex items-start justify-between gap-4">
									<span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-gold">
										<Scissors className="size-5" />
									</span>
									<div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-gold">
										<Star className="size-3 fill-current" /> {salon.rating.toFixed(1)}
									</div>
								</div>
								<h2 className="mt-6 text-xl font-semibold tracking-tight">{salon.name}</h2>
								<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{salon.description}</p>
								<p className="mt-4 flex items-center gap-2 text-sm">
									<MapPin className="size-4 shrink-0 text-gold" /> {salon.address}
								</p>
								<div className="mt-5 flex gap-5 border-t border-border/70 pt-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1.5"><Scissors className="size-3.5" /> {salon._count.services} services</span>
									<span className="flex items-center gap-1.5"><Users className="size-3.5" /> {salon._count.staff} professionals</span>
								</div>
								<Button className="mt-6 h-10 w-full rounded-full" onClick={() => openServices(salon.id)}>
									View services & book <ArrowRight className="size-4" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Dialog open={selectedId !== null} onOpenChange={(open) => { if (!open) closeDialog(); }}>
				<DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
					<DialogHeader>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Choose your appointment</p>
						<DialogTitle className="text-2xl">{details?.name || "Loading salon…"}</DialogTitle>
						{details && (
							<p className="flex items-center gap-2 text-sm text-muted-foreground">
								<MapPin className="size-3.5" /> {details.address}
							</p>
						)}
					</DialogHeader>

					{error && (
						<p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
							{error}
						</p>
					)}

					{!details ? (
						<div className="h-64 animate-pulse rounded-2xl bg-muted/60" />
					) : (
						<form onSubmit={book} className="space-y-6">
							<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">1</span> Service
								<span className="h-px flex-1 bg-border" />
								<span className={serviceId ? "rounded-full bg-primary px-2.5 py-1 text-primary-foreground" : "rounded-full bg-muted px-2.5 py-1"}>2</span> Details
								<span className="h-px flex-1 bg-border" />
								<span className={slot ? "rounded-full bg-primary px-2.5 py-1 text-primary-foreground" : "rounded-full bg-muted px-2.5 py-1"}>3</span> Time
							</div>

							<DataTableToolbar>
								<div className="relative w-full">
									<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										value={serviceSearch}
										onChange={(event) => setServiceSearch(event.target.value)}
										placeholder="Search this salon's services…"
										className="h-10 rounded-xl border-0 bg-background pl-9 ring-1 ring-border/70"
									/>
								</div>
							</DataTableToolbar>

							<DataTable
								columns={serviceColumns}
								data={filteredServices}
								getRowKey={(service) => service.id}
								ariaLabel={`Services at ${details.name}`}
								emptyTitle="No matching services"
								emptyDescription="Try a different service name."
								rowClassName={(service) => service.id === serviceId ? "bg-primary/5 hover:bg-primary/8" : undefined}
							/>

							{selectedService && (
								<div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Selected service</p>
											<p className="mt-1 font-semibold">{selectedService.name}</p>
										</div>
										<div className="flex gap-4 text-sm">
											<span>{formatDuration(selectedService.duration)}</span>
											<span className="font-semibold">{money.format(Number(selectedService.price))}</span>
										</div>
									</div>

									<div className="mt-5 grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="booking-staff">Professional</Label>
											<select
												id="booking-staff"
												className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
												value={staffId}
												onChange={(event) => {
													setStaffId(event.target.value);
													resetAvailability();
												}}
												required>
												<option value="">Choose a professional</option>
												{details.staff.map((staff) => (
													<option key={staff.id} value={staff.id}>
														{staff.user.name}{staff.specialty ? ` · ${staff.specialty}` : ""}
													</option>
												))}
											</select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="booking-date">Date</Label>
											<Input
												id="booking-date"
												type="date"
												min={minDate}
												max={maxDate}
												value={date}
												onChange={(event) => {
													setDate(event.target.value);
													resetAvailability();
												}}
												className="h-11 rounded-xl"
												required
											/>
										</div>
									</div>
								</div>
							)}

							{serviceId && staffId && date && (
								<div className="space-y-3">
									<Label>Available times</Label>
									{loadingSlots ? (
										<p className="text-sm text-muted-foreground">Finding available times…</p>
									) : slots.length === 0 ? (
										<p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
											No available times on this date. Try another day.
										</p>
									) : (
										<div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
											{slots.map((time) => (
												<Button
													key={time}
													type="button"
													variant={slot === time ? "default" : "outline"}
													className="rounded-xl"
													onClick={() => setSlot(time)}>
													{new Date(time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
												</Button>
											))}
										</div>
									)}
								</div>
							)}

							{slot && (
								<div className="space-y-2">
									<Label htmlFor="booking-notes">Notes <span className="font-normal text-muted-foreground">(optional)</span></Label>
									<Input
										id="booking-notes"
										maxLength={500}
										value={notes}
										onChange={(event) => setNotes(event.target.value)}
										placeholder="Anything your professional should know"
										className="h-11 rounded-xl"
									/>
								</div>
							)}

							<DialogFooter className="border-t border-border/70 pt-5">
								<Button type="button" variant="outline" className="rounded-full" onClick={closeDialog}>
									Cancel
								</Button>
								<Button type="submit" className="rounded-full" disabled={!slot || saving}>
									<CalendarDays className="size-4" />
									{saving ? "Booking…" : "Confirm appointment"}
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
