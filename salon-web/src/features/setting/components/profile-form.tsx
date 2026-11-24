"use client";

import { useMemo, useState } from "react";
import { AtSignIcon, LoaderCircleIcon, MapPinIcon, PhoneIcon, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore } from "@/stores/auth-store";
import { FormMessage, SettingsPanel } from "./settings-ui";

export function ProfileForm() {
	const user = useAuthStore((state) => state.user);
	const updateProfile = useAuthStore((state) => state.updateProfile);
	const [name, setName] = useState(user?.name ?? "");
	const [phone, setPhone] = useState(user?.phone ?? "");
	const [address, setAddress] = useState(user?.address ?? "");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const initials = useMemo(
		() => (user?.name || "User").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
		[user?.name],
	);
	const isDirty = name !== (user?.name ?? "") || phone !== (user?.phone ?? "") || address !== (user?.address ?? "");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setMessage(null);
		try {
			await updateProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
			setMessage({ type: "success", text: "Profile changes saved." });
		} catch (submitError: unknown) {
			setMessage({ type: "error", text: getErrorMessage(submitError, "Unable to update your profile") });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<SettingsPanel icon={UserRoundIcon} title="Profile details" description="Keep your personal and contact information up to date." footer={
				<>
					<div className="min-h-5">{message && <FormMessage type={message.type}>{message.text}</FormMessage>}</div>
					<Button type="submit" size="lg" className="min-w-32" disabled={isLoading || !isDirty}>
						{isLoading && <LoaderCircleIcon className="animate-spin" />}{isLoading ? "Saving" : "Save changes"}
					</Button>
				</>
			}>
				<div className="mb-6 flex items-center gap-4 rounded-xl border border-border/70 bg-muted/25 p-4">
					<Avatar className="size-14" aria-label={`${user?.name ?? "User"} avatar`}>
						{user?.avatar && <AvatarImage src={user.avatar} alt="" />}
						<AvatarFallback className="bg-primary/15 font-semibold text-gold">{initials}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate text-base font-semibold">{user?.name || "Your profile"}</p>
						<p className="truncate text-sm text-muted-foreground">{user?.email}</p>
						<span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-gold">{user?.role}</span>
					</div>
				</div>
				<div className="grid gap-5 sm:grid-cols-2">
					<div className="space-y-2"><Label htmlFor="settings-name">Full name</Label><div className="relative"><UserRoundIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="settings-name" className="h-11 pl-10" value={name} onChange={(event) => setName(event.target.value)} required /></div></div>
					<div className="space-y-2"><Label htmlFor="settings-email">Email address</Label><div className="relative"><AtSignIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="settings-email" type="email" className="h-11 pl-10" value={user?.email ?? ""} disabled /></div><p className="text-xs leading-5 text-muted-foreground">Used for sign-in and account recovery.</p></div>
					<div className="space-y-2"><Label htmlFor="settings-phone">Phone number</Label><div className="relative"><PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="settings-phone" type="tel" className="h-11 pl-10" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+95 9 000 000 000" required /></div></div>
					<div className="space-y-2"><Label htmlFor="settings-address">Address</Label><div className="relative"><MapPinIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="settings-address" className="h-11 pl-10" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="City or street address" /></div></div>
				</div>
			</SettingsPanel>
		</form>
	);
}
