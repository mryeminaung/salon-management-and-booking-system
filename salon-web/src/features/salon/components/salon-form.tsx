"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Building2, Clock3, Eye, EyeOff, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Salon } from "../hooks/use-salons";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

type SalonPayload = {
	name: string;
	address: string;
	phone: string;
	description: string;
	isPublished?: boolean;
	openingHours?: Record<string, string>;
};

interface SalonFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	salon?: Salon | null;
	onSubmit: (data: SalonPayload) => Promise<void>;
}

interface SalonFormContentProps extends Omit<SalonFormProps, "open"> {
	salon?: Salon | null;
}

function getInitialData(salon?: Salon | null) {
	return {
		name: salon?.name ?? "",
		address: salon?.address ?? "",
		phone: salon?.phone ?? "",
		description: salon?.description ?? "",
		isPublished: salon?.isPublished ?? true,
		openingHours: (salon?.openingHours as Record<string, string> | undefined) ?? {},
	};
}

function SalonFormContent({ salon, onOpenChange, onSubmit }: SalonFormContentProps) {
	const [formData, setFormData] = useState(() => getInitialData(salon));
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			await onSubmit({
				name: formData.name.trim(),
				address: formData.address.trim(),
				phone: formData.phone.trim(),
				description: formData.description.trim(),
				isPublished: formData.isPublished,
				openingHours: Object.keys(formData.openingHours).length > 0 ? formData.openingHours : undefined,
			});
			onOpenChange(false);
		} catch (submitError) {
			const apiError = submitError as AxiosError<{ error?: string }>;
			setError(apiError.response?.data?.error ?? apiError.message ?? "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	const updateOpeningHours = (day: string, value: string) => {
		setFormData((current) => ({
			...current,
			openingHours: { ...current.openingHours, [day]: value },
		}));
	};

	const toggleClosed = (day: string) => {
		updateOpeningHours(day, formData.openingHours[day] === "closed" ? "" : "closed");
	};

	return (
		<DialogContent className="flex max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-2xl [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:top-4">
			<DialogHeader className="border-b border-border/70 px-6 py-4 pr-14 text-left">
				<div className="flex items-start gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold ring-1 ring-gold/15">
						<Building2 className="size-5" />
					</span>
					<div className="min-w-0 pt-0.5">
						<DialogTitle className="text-lg font-semibold leading-6">{salon ? "Edit salon" : "Add a salon"}</DialogTitle>
						<DialogDescription className="mt-1 text-sm leading-5">
							{salon
								? "Update this location’s customer-facing details and availability."
								: "Create a location, set its weekly hours, and choose when customers can discover it."}
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<form onSubmit={handleSubmit} autoComplete="off" className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{error && (
						<p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
							{error}
						</p>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="salon-name">Salon name</Label>
							<div className="relative">
								<Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input id="salon-name" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Lumière Downtown" className="h-11 rounded-xl pl-9" required />
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="salon-phone">Phone number</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input id="salon-phone" type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="+95 9 000 000 000" className="h-11 rounded-xl pl-9" required />
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="salon-address">Address</Label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
							<textarea id="salon-address" value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} placeholder="Street, township, city" className="min-h-20 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" required />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="salon-description">Description</Label>
						<textarea id="salon-description" value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} placeholder="Tell customers what makes this location special." className="min-h-24 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" required />
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Clock3 className="size-4 text-gold" />
							<div>
								<Label>Weekly opening hours</Label>
								<p className="text-xs text-muted-foreground">Use a time range or mark a day as closed.</p>
							</div>
						</div>
						<div className="overflow-hidden rounded-xl border border-border/70">
							{DAYS.map((day) => {
								const isClosed = formData.openingHours[day] === "closed";
								return (
									<div key={day} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 border-b border-border/60 px-3 py-2.5 last:border-0 sm:grid-cols-[7rem_1fr_auto]">
										<span className="text-sm font-medium capitalize">{day}</span>
										<Input aria-label={`${day} opening hours`} placeholder="09:00-18:00" value={isClosed ? "" : formData.openingHours[day] ?? ""} onChange={(event) => updateOpeningHours(day, event.target.value)} disabled={isClosed} className="h-9 rounded-lg" />
										<Button type="button" variant={isClosed ? "secondary" : "ghost"} size="sm" onClick={() => toggleClosed(day)} className="rounded-lg px-2.5 text-xs">
											{isClosed ? "Closed" : "Close"}
										</Button>
									</div>
								);
							})}
						</div>
					</div>

					<button type="button" onClick={() => setFormData((current) => ({ ...current, isPublished: !current.isPublished }))} className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-left transition-colors hover:bg-muted/60">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-gold ring-1 ring-border/70">
							{formData.isPublished ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
						</span>
						<span className="min-w-0 flex-1">
							<span className="block text-sm font-semibold">{formData.isPublished ? "Published for booking" : "Hidden from booking"}</span>
							<span className="block text-xs leading-5 text-muted-foreground">
								{formData.isPublished ? "Customers can discover this salon and book its services." : "Only your team can see this salon until it is published."}
							</span>
						</span>
						<span aria-hidden="true" className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${formData.isPublished ? "bg-primary" : "bg-muted-foreground/30"}`}>
							<span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${formData.isPublished ? "translate-x-6" : "translate-x-1"}`} />
						</span>
					</button>
				</div>

				<DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-border/70 bg-muted/20 px-6 py-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="h-10 rounded-xl px-4 sm:min-w-24">
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isLoading}
						className="h-10 rounded-xl px-5 sm:min-w-36">
						{isLoading ? "Saving…" : salon ? "Save changes" : "Create salon"}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function SalonForm({ open, onOpenChange, salon, onSubmit }: SalonFormProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{open && <SalonFormContent key={salon?.id ?? "new-salon"} salon={salon} onOpenChange={onOpenChange} onSubmit={onSubmit} />}
		</Dialog>
	);
}
