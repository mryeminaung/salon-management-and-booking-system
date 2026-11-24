"use client";

import { useState, type FormEvent } from "react";
import { BriefcaseBusiness, Building2, CheckCircle2, Eye, EyeOff, KeyRound, Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore, type User } from "@/stores/auth-store";

import { useStaffProfile } from "../hooks/use-staff-profile";

function PersonalDetailsForm({ user }: { user: User }) {
	const updateProfile = useAuthStore((state) => state.updateProfile);
	const [name, setName] = useState(user.name ?? "");
	const [phone, setPhone] = useState(user.phone ?? "");
	const [address, setAddress] = useState(user.address ?? "");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setMessage(null);
		try {
			await updateProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
			setMessage({ type: "success", text: "Profile details updated." });
		} catch (submitError) {
			setMessage({ type: "error", text: getErrorMessage(submitError, "Unable to update profile") });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader><CardTitle className="flex items-center gap-2 text-base font-semibold"><UserRound className="size-5 text-gold" /> Personal details</CardTitle><p className="text-sm text-muted-foreground">Keep your contact information current for your team.</p></CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{message && <p className={message.type === "success" ? "rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" : "rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive"}>{message.text}</p>}
					<div className="space-y-2"><Label htmlFor="staff-profile-name">Full name</Label><Input id="staff-profile-name" value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl" required /></div>
					<div className="space-y-2"><Label htmlFor="staff-profile-email">Sign-in email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="staff-profile-email" type="email" value={user.email} className="h-11 rounded-xl pl-9" disabled /></div><p className="text-xs text-muted-foreground">Your sign-in email can only be changed by an administrator.</p></div>
					<div className="space-y-2"><Label htmlFor="staff-profile-phone">Phone number</Label><div className="relative"><Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="staff-profile-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-xl pl-9" required /></div></div>
					<div className="space-y-2"><Label htmlFor="staff-profile-address">Address</Label><div className="relative"><MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><textarea id="staff-profile-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, township, city" className="min-h-24 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-3 pl-9 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" /></div></div>
					<div className="flex justify-end"><Button type="submit" disabled={isLoading} className="h-10 rounded-xl px-5">{isLoading ? "Saving…" : "Save changes"}</Button></div>
				</form>
			</CardContent>
		</Card>
	);
}

function SecurityForm() {
	const changePassword = useAuthStore((state) => state.changePassword);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage(null);
		if (newPassword.length < 6) return setMessage({ type: "error", text: "New password must be at least 6 characters." });
		if (newPassword !== confirmPassword) return setMessage({ type: "error", text: "New passwords do not match." });
		setIsLoading(true);
		try {
			await changePassword(currentPassword, newPassword);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setMessage({ type: "success", text: "Password updated successfully." });
		} catch (submitError) {
			setMessage({ type: "error", text: getErrorMessage(submitError, "Unable to update password") });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader><CardTitle className="flex items-center gap-2 text-base font-semibold"><ShieldCheck className="size-5 text-gold" /> Account security</CardTitle><p className="text-sm text-muted-foreground">Choose a strong password you do not use elsewhere.</p></CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{message && <p className={message.type === "success" ? "rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" : "rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive"}>{message.text}</p>}
					<div className="space-y-2"><Label htmlFor="current-password">Current password</Label><div className="relative"><KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="current-password" type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-11 rounded-xl px-9" required /><button type="button" onClick={() => setShowCurrent((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showCurrent ? "Hide password" : "Show password"}>{showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
					<div className="space-y-2"><Label htmlFor="new-password">New password</Label><div className="relative"><KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="new-password" type={showNew ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-11 rounded-xl px-9" minLength={6} required /><button type="button" onClick={() => setShowNew((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showNew ? "Hide password" : "Show password"}>{showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
					<div className="space-y-2"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" type={showNew ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 rounded-xl" minLength={6} required /></div>
					<div className="flex justify-end"><Button type="submit" disabled={isLoading} className="h-10 rounded-xl px-5">{isLoading ? "Updating…" : "Update password"}</Button></div>
				</form>
			</CardContent>
		</Card>
	);
}

export function StaffProfile() {
	const user = useAuthStore((state) => state.user);
	const { profile, isLoading, error } = useStaffProfile();
	if (!user) return null;
	const initials = user.name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);

	return (
		<div className="space-y-7">
			<div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold"><UserRound className="size-3.5" /> Personal account</div><h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">My profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Manage your contact details, workplace information, and account security.</p></div>
			{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}
			<Card className="ring-gold/20"><CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-semibold text-gold">{initials}</span><div className="min-w-0 flex-1"><h2 className="truncate text-xl font-semibold">{user.name}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-gold">{user.role}</span>{profile?.specialty && <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"><BriefcaseBusiness className="size-3.5" /> {profile.specialty}</span>}{profile?.isActive && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-3.5" /> Active</span>}</div></div>{isLoading ? <Skeleton className="h-16 w-full rounded-xl sm:w-56" /> : profile?.salon ? <div className="rounded-xl border border-border/70 bg-muted/25 p-3 sm:max-w-64"><p className="flex items-center gap-2 text-sm font-semibold"><Building2 className="size-4 text-gold" /> {profile.salon.name}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{profile.salon.address}</p></div> : <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-3 text-sm text-amber-700 dark:text-amber-400">Not assigned to a salon</div>}</CardContent></Card>
			<div className="grid gap-4 lg:grid-cols-2"><PersonalDetailsForm key={`${user.id}-${user.name}-${user.phone}-${user.address}`} user={user} /><SecurityForm /></div>
		</div>
	);
}
