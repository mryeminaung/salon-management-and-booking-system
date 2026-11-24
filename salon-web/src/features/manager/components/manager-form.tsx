"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound, Mail, MapPin, Phone, RefreshCw, UserRoundCog } from "lucide-react";

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
import { getErrorMessage } from "@/lib/get-error-message";
import { CredentialsDisplayDialog } from "@/features/staff/components/credentials-display-dialog";

import type { Manager } from "../hooks/use-managers";

export interface ManagerFormData {
	name: string;
	email: string;
	password: string;
	phone: string;
	address: string;
}

interface ManagerFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	manager?: Manager | null;
	onSubmit: (data: ManagerFormData) => Promise<void>;
}

function generatePassword(length = 10) {
	const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => characters[byte % characters.length]).join("");
}

function ManagerFormContent({
	manager,
	onOpenChange,
	onSubmit,
	onCreated,
}: Omit<ManagerFormProps, "open"> & { onCreated: (credentials: { name: string; email: string; password: string }) => void }) {
	const isEditing = Boolean(manager);
	const [formData, setFormData] = useState<ManagerFormData>(() => ({
		name: manager?.user?.name ?? "",
		email: manager?.user?.email ?? "",
		password: "",
		phone: manager?.user?.phone ?? "",
		address: manager?.user?.address ?? "",
	}));
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			const payload = {
				name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password,
				phone: formData.phone.trim(),
				address: formData.address.trim(),
			};
			await onSubmit(payload);
			onOpenChange(false);
			if (!isEditing) onCreated({ name: payload.name, email: payload.email, password: payload.password });
		} catch (submitError) {
			setError(getErrorMessage(submitError, "Unable to save this manager"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="flex max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-xl [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:top-4">
			<DialogHeader className="border-b border-border/70 px-6 py-4 pr-14 text-left">
				<div className="flex items-start gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold ring-1 ring-gold/15"><UserRoundCog className="size-5" /></span>
					<div className="min-w-0 pt-0.5">
						<DialogTitle className="text-lg font-semibold leading-6">{isEditing ? "Edit manager" : "Add a manager"}</DialogTitle>
						<DialogDescription className="mt-1 text-sm leading-5">{isEditing ? "Update contact details for this manager account." : "Create secure login credentials for a new salon manager."}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden" autoComplete="off">
				<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}

					{isEditing ? (
						<div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-4">
							<span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-gold">{manager?.user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
							<div className="min-w-0"><p className="truncate text-sm font-semibold">{manager?.user?.name}</p><p className="truncate text-xs text-muted-foreground">{manager?.user?.email}</p></div>
						</div>
					) : (
						<>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2"><Label htmlFor="manager-name">Full name</Label><Input id="manager-name" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Manager name" className="h-11 rounded-xl" required /></div>
								<div className="space-y-2"><Label htmlFor="manager-email">Email address</Label><div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="manager-email" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder="manager@example.com" className="h-11 rounded-xl pl-9" required /></div></div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between gap-3"><Label htmlFor="manager-password">Temporary password</Label><button type="button" onClick={() => setFormData((current) => ({ ...current, password: generatePassword() }))} className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-foreground"><RefreshCw className="size-3.5" /> Generate</button></div>
								<div className="relative"><KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="manager-password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} className="h-11 rounded-xl px-9" minLength={6} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
								<p className="text-xs text-muted-foreground">The password is shown once after account creation.</p>
							</div>
						</>
					)}

					<div className="space-y-2"><Label htmlFor="manager-phone">Phone number</Label><div className="relative"><Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="manager-phone" type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} placeholder="+95 9 000 000 000" className="h-11 rounded-xl pl-9" required /></div></div>
					{isEditing && <div className="space-y-2"><Label htmlFor="manager-address">Address</Label><div className="relative"><MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><textarea id="manager-address" value={formData.address} onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))} placeholder="Street, township, city" className="min-h-20 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-3 pl-9 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" /></div></div>}
				</div>

				<DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-border/70 bg-muted/20 px-6 py-3">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 rounded-xl px-4 sm:min-w-24">Cancel</Button>
					<Button type="submit" disabled={isLoading} className="h-10 rounded-xl px-5 sm:min-w-36">{isLoading ? "Saving…" : isEditing ? "Save changes" : "Create manager"}</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function ManagerForm({ open, onOpenChange, manager, onSubmit }: ManagerFormProps) {
	const [credentials, setCredentials] = useState<{ name: string; email: string; password: string } | null>(null);
	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				{open && <ManagerFormContent key={manager?.id ?? "new-manager"} manager={manager} onOpenChange={onOpenChange} onSubmit={onSubmit} onCreated={setCredentials} />}
			</Dialog>
			<CredentialsDisplayDialog open={credentials !== null} onOpenChange={(nextOpen) => { if (!nextOpen) setCredentials(null); }} credentials={credentials} />
		</>
	);
}
