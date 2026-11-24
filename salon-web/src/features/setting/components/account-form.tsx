"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, KeyRoundIcon, LoaderCircleIcon, LockKeyholeIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore } from "@/stores/auth-store";
import { FormMessage, SettingsPanel } from "./settings-ui";

function PasswordField({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete: string }) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<LockKeyholeIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input id={id} type={visible ? "text" : "password"} className="h-11 px-10" placeholder="Enter password" value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required minLength={id === "current-password" ? undefined : 6} />
				<button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
					{visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
				</button>
			</div>
		</div>
	);
}

export function AccountForm() {
	const changePassword = useAuthStore((state) => state.changePassword);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setMessage(null);
		if (newPassword !== confirmPassword) { setMessage({ type: "error", text: "New passwords do not match." }); return; }
		if (newPassword.length < 6) { setMessage({ type: "error", text: "Use at least 6 characters for your new password." }); return; }
		setIsLoading(true);
		try {
			await changePassword(currentPassword, newPassword);
			setMessage({ type: "success", text: "Password updated successfully." });
			setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
		} catch (submitError: unknown) {
			setMessage({ type: "error", text: getErrorMessage(submitError, "Unable to update your password") });
		} finally { setIsLoading(false); }
	};

	return (
		<form onSubmit={handleSubmit}>
			<SettingsPanel icon={KeyRoundIcon} title="Account security" description="Choose a strong, unique password to protect your account." footer={
				<>
					<div className="min-h-5">{message && <FormMessage type={message.type}>{message.text}</FormMessage>}</div>
					<Button type="submit" size="lg" className="min-w-36" disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}>{isLoading && <LoaderCircleIcon className="animate-spin" />}{isLoading ? "Updating" : "Update password"}</Button>
				</>
			}>
				<div className="mb-6 flex gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4"><ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-gold" /><div><p className="font-semibold">Password protection</p><p className="mt-1 text-sm leading-5 text-muted-foreground">We’ll never ask for your password by email or notification.</p></div></div>
				<div className="space-y-5">
					<PasswordField id="current-password" label="Current password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
					<div className="grid gap-5 sm:grid-cols-2"><PasswordField id="new-password" label="New password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" /><PasswordField id="confirm-password" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" /></div>
					<p className="text-xs leading-5 text-muted-foreground">Use at least 6 characters. A mix of letters, numbers, and symbols is safest.</p>
				</div>
			</SettingsPanel>
		</form>
	);
}
