"use client";

import { useState, type FormEvent } from "react";
import { BriefcaseBusiness, Eye, EyeOff, KeyRound, Mail, Phone, RefreshCw, UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/get-error-message";

import type { Staff } from "../hooks/use-staff";
import { CredentialsDisplayDialog } from "./credentials-display-dialog";

const SPECIALTY_OPTIONS = ["Hair Stylist", "Colorist", "Barber", "Nail Technician", "Esthetician", "Makeup Artist", "Massage Therapist"];

export interface StaffFormData {
	name: string;
	email: string;
	password: string;
	phone: string;
	specialty: string;
}

interface StaffFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	staff?: Staff | null;
	onSubmit: (data: StaffFormData) => Promise<void>;
}

function generatePassword(length = 10) {
	const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => characters[byte % characters.length]).join("");
}

function StaffFormContent({ staff, onOpenChange, onSubmit, onCreated }: Omit<StaffFormProps, "open"> & { onCreated: (credentials: { name: string; email: string; password: string }) => void }) {
	const isEditing = Boolean(staff);
	const [formData, setFormData] = useState<StaffFormData>(() => ({
		name: staff?.user?.name ?? "",
		email: staff?.user?.email ?? "",
		password: "",
		phone: staff?.user?.phone ?? "",
		specialty: staff?.specialty ?? "",
	}));
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");
		if (!formData.specialty) {
			setError("Select a primary specialty.");
			return;
		}
		setIsLoading(true);
		try {
			const payload = { ...formData, name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim() };
			await onSubmit(payload);
			onOpenChange(false);
			if (!isEditing) onCreated({ name: payload.name, email: payload.email, password: payload.password });
		} catch (submitError) {
			setError(getErrorMessage(submitError, "Unable to save this staff account"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="flex max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-xl [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:top-4">
			<DialogHeader className="border-b border-border/70 px-6 py-4 pr-14 text-left">
				<div className="flex items-start gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold ring-1 ring-gold/15"><UserRoundPlus className="size-5" /></span>
					<div className="min-w-0 pt-0.5"><DialogTitle className="text-lg font-semibold leading-6">{isEditing ? "Edit staff member" : "Add a staff member"}</DialogTitle><DialogDescription className="mt-1 text-sm leading-5">{isEditing ? "Update profile and specialty information." : "Create a staff login and define their primary specialty."}</DialogDescription></div>
				</div>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden" autoComplete="off">
				<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2"><Label htmlFor="staff-name">Full name</Label><Input id="staff-name" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Staff member name" className="h-11 rounded-xl" required /></div>
						{!isEditing ? <div className="space-y-2"><Label htmlFor="staff-email">Email address</Label><div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="staff-email" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder="staff@example.com" className="h-11 rounded-xl pl-9" required /></div></div> : <div className="space-y-2"><Label>Account email</Label><div className="flex h-11 items-center rounded-xl border border-border/70 bg-muted/35 px-3 text-sm text-muted-foreground">{staff?.user?.email}</div></div>}
					</div>

					{!isEditing && (
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-3"><Label htmlFor="staff-password">Temporary password</Label><button type="button" onClick={() => setFormData((current) => ({ ...current, password: generatePassword() }))} className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-foreground"><RefreshCw className="size-3.5" /> Generate</button></div>
							<div className="relative"><KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="staff-password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} className="h-11 rounded-xl px-9" minLength={6} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
							<p className="text-xs text-muted-foreground">The password is shown once after account creation.</p>
						</div>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2"><Label htmlFor="staff-phone">Phone number</Label><div className="relative"><Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="staff-phone" type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="+95 9 000 000 000" className="h-11 rounded-xl pl-9" required /></div></div>
						<div className="space-y-2"><Label htmlFor="staff-specialty">Primary specialty <span className="text-destructive" aria-hidden="true">*</span></Label><Select name="specialty" required value={formData.specialty || null} onValueChange={(value) => { setFormData((current) => ({ ...current, specialty: value ?? "" })); if (value) setError((current) => current === "Select a primary specialty." ? "" : current); }}><SelectTrigger id="staff-specialty" className="w-full rounded-xl px-3 py-3 data-[size=default]:h-11" aria-invalid={error === "Select a primary specialty." || undefined}><SelectValue placeholder="Select specialty">{formData.specialty || "Select specialty"}</SelectValue></SelectTrigger><SelectContent>{SPECIALTY_OPTIONS.map((specialty) => <SelectItem key={specialty} value={specialty}><BriefcaseBusiness className="size-4 text-gold" /> {specialty}</SelectItem>)}</SelectContent></Select></div>
					</div>
				</div>

				<DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-border/70 bg-muted/20 px-6 py-3">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 rounded-xl px-4 sm:min-w-24">Cancel</Button>
					<Button type="submit" disabled={isLoading} className="h-10 rounded-xl px-5 sm:min-w-36">{isLoading ? "Saving…" : isEditing ? "Save changes" : "Create staff"}</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function StaffForm({ open, onOpenChange, staff, onSubmit }: StaffFormProps) {
	const [credentials, setCredentials] = useState<{ name: string; email: string; password: string } | null>(null);
	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>{open && <StaffFormContent key={staff?.id ?? "new-staff"} staff={staff} onOpenChange={onOpenChange} onSubmit={onSubmit} onCreated={setCredentials} />}</Dialog>
			<CredentialsDisplayDialog open={credentials !== null} onOpenChange={(nextOpen) => { if (!nextOpen) setCredentials(null); }} credentials={credentials} />
		</>
	);
}
