import type { LucideIcon } from "lucide-react";
import { CheckCircle2Icon, CircleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "cn";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SettingsPanel({
	icon: Icon,
	title,
	description,
	children,
	footer,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-sm hover:shadow-sm">
			<CardHeader className="grid-cols-[auto_1fr] items-center gap-x-4 border-b border-border/70 px-5 py-5 sm:px-6">
				<span className="row-span-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-gold ring-1 ring-primary/15">
					<Icon className="size-5" />
				</span>
				<CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
				<CardDescription className="mt-0.5 leading-5">{description}</CardDescription>
			</CardHeader>
			<CardContent className="p-5 sm:p-6">{children}</CardContent>
			{footer && (
				<div className="flex flex-col-reverse gap-3 border-t border-border/70 bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					{footer}
				</div>
			)}
		</Card>
	);
}

export function FormMessage({
	type,
	children,
}: {
	type: "success" | "error";
	children: ReactNode;
}) {
	const Icon = type === "success" ? CheckCircle2Icon : CircleAlertIcon;

	return (
		<p
			role={type === "error" ? "alert" : "status"}
			className={cn(
				"flex items-center gap-2 text-sm font-medium",
				type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
			)}>
			<Icon className="size-4 shrink-0" />
			{children}
		</p>
	);
}

export function PreferenceToggle({
	checked,
	onCheckedChange,
	label,
	description,
	icon: Icon,
}: {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	label: string;
	description: string;
	icon?: LucideIcon;
}) {
	return (
		<div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-4">
			{Icon && (
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
					<Icon className="size-4" />
				</span>
			)}
			<div className="min-w-0 flex-1">
				<p className="font-semibold leading-5">{label}</p>
				<p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				aria-label={label}
				onClick={() => onCheckedChange(!checked)}
				className={cn(
					"relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
					checked ? "border-primary bg-primary" : "border-border bg-muted",
				)}>
				<span
					className={cn(
						"absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
						checked ? "translate-x-5" : "translate-x-0",
					)}
				/>
			</button>
		</div>
	);
}
