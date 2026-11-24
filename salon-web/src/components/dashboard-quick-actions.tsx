import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";

export interface DashboardQuickAction {
	label: string;
	description: string;
	href: string;
	icon: ComponentType<{ className?: string }>;
}

export function DashboardQuickActions({ actions }: { actions: DashboardQuickAction[] }) {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
				<p className="mt-1 text-sm text-muted-foreground">Jump straight to the tasks you use most.</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{actions.map((action) => (
					<Link
						key={action.href}
						href={action.href}
						className="group flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-gold/35 hover:bg-card hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold ring-1 ring-gold/10">
							<action.icon className="size-5" />
						</span>
						<span className="min-w-0 flex-1">
							<span className="block truncate text-sm font-semibold">{action.label}</span>
							<span className="mt-0.5 block truncate text-xs text-muted-foreground">{action.description}</span>
						</span>
						<span className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-gold">
							<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
