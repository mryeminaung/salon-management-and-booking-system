"use client";

import { useState } from "react";
import { Check, CheckCircle2, Copy, Eye, EyeOff, KeyRound, Mail, ShieldAlert, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Credentials {
	name: string;
	email: string;
	password: string;
}

interface CredentialsDisplayDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	credentials: Credentials | null;
}

function CredentialsContent({ credentials, onOpenChange }: { credentials: Credentials; onOpenChange: (open: boolean) => void }) {
	const [showPassword, setShowPassword] = useState(false);
	const [copied, setCopied] = useState<"all" | "password" | null>(null);
	const [copyError, setCopyError] = useState("");
	const credentialsText = `New account created\nName: ${credentials.name}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nSave this password now. It will not be shown again.`;

	const copyText = async (text: string, target: "all" | "password") => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(target);
			setCopyError("");
			window.setTimeout(() => setCopied(null), 2000);
		} catch {
			setCopyError("Clipboard access was blocked. Select and copy the credentials manually.");
		}
	};

	return (
		<DialogContent className="overflow-hidden p-0 sm:max-w-md [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:top-4">
			<DialogHeader className="border-b border-border/70 px-6 py-4 pr-14 text-left">
				<div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-5" /></span><div className="pt-0.5"><DialogTitle className="text-lg font-semibold leading-6">Account created</DialogTitle><DialogDescription className="mt-1 leading-5">Save these login credentials before closing this window.</DialogDescription></div></div>
			</DialogHeader>
			<div className="space-y-4 px-6 py-5">
				<div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 p-3 text-sm"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" /><p><span className="font-semibold">One-time password.</span> For security, it will not be available again after you close this dialog.</p></div>
				<div className="overflow-hidden rounded-xl border border-border/70">
					<div className="flex items-center gap-3 border-b border-border/60 px-3 py-3"><UserRound className="size-4 text-gold" /><div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Name</p><p className="truncate text-sm font-semibold">{credentials.name}</p></div></div>
					<div className="flex items-center gap-3 border-b border-border/60 px-3 py-3"><Mail className="size-4 text-gold" /><div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Email</p><p className="truncate text-sm font-semibold">{credentials.email}</p></div></div>
					<div className="flex items-center gap-3 px-3 py-3"><KeyRound className="size-4 shrink-0 text-gold" /><div className="min-w-0 flex-1"><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Temporary password</p><code className="block truncate text-sm font-semibold tracking-wide">{showPassword ? credentials.password : "••••••••••"}</code></div><Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button><Button type="button" variant="ghost" size="icon-sm" onClick={() => void copyText(credentials.password, "password")} aria-label="Copy password">{copied === "password" ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}</Button></div>
				</div>
				{copyError && <p className="text-xs text-destructive">{copyError}</p>}
				<Button type="button" variant="outline" className="h-10 w-full rounded-xl" onClick={() => void copyText(credentialsText, "all")}>{copied === "all" ? <><Check className="size-4 text-emerald-600" /> Copied credentials</> : <><Copy className="size-4" /> Copy all credentials</>}</Button>
			</div>
			<DialogFooter className="mx-0 mb-0 rounded-none border-t border-border/70 bg-muted/20 px-6 py-3"><Button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl px-5 sm:min-w-28">Done</Button></DialogFooter>
		</DialogContent>
	);
}

export function CredentialsDisplayDialog({ open, onOpenChange, credentials }: CredentialsDisplayDialogProps) {
	return <Dialog open={open} onOpenChange={onOpenChange}>{credentials && <CredentialsContent key={`${credentials.email}-${credentials.password}`} credentials={credentials} onOpenChange={onOpenChange} />}</Dialog>;
}
