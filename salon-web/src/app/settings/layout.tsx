"use client";

import { ProtectedLayout } from "@/components/protected-layout";
import { RoleGuard } from "@/components/role-guard";
import { cn } from "cn";
import {
	BellIcon,
	ChevronRightIcon,
	KeyIcon,
	MonitorIcon,
	PaletteIcon,
	Settings2Icon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{
		id: "profile",
		label: "Profile",
		description: "Personal details",
		icon: UserIcon,
		slug: "profile",
	},
	{ id: "account", label: "Account", description: "Password & security", icon: KeyIcon, slug: "account" },
	{
		id: "appearance",
		label: "Appearance",
		description: "Theme preferences",
		icon: PaletteIcon,
		slug: "appearance",
	},
	{
		id: "notifications",
		label: "Notifications",
		description: "Alerts & updates",
		icon: BellIcon,
		slug: "notifications",
	},
	{
		id: "display",
		label: "Display",
		description: "Layout & formatting",
		icon: MonitorIcon,
		slug: "display",
	},
];

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const basePath = pathname.startsWith("/admin/settings") ? "/admin/settings" : "/settings";

	return (
		<ProtectedLayout>
			<RoleGuard allowedRoles={["owner", "manager", "staff", "customer"]}>
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
							<Settings2Icon className="size-3.5" /> Workspace preferences
						</div>
						<h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Settings</h1>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
							Manage your profile, security, and workspace preferences.
						</p>
					</div>

					<div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
						<nav aria-label="Settings navigation" className="flex gap-2 overflow-x-auto rounded-2xl border border-border/70 bg-card p-2 shadow-sm [scrollbar-width:none] lg:sticky lg:top-20 lg:flex-col [&::-webkit-scrollbar]:hidden">
							{navItems.map((item) => {
								const href = `${basePath}/${item.slug}`;
								const isActive = pathname === href;
								return (
									<Link
										key={item.id}
										href={href}
										aria-current={isActive ? "page" : undefined}
										className={cn(
											"group flex min-w-max items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition-colors lg:min-w-0",
											isActive ? "border-primary/20 bg-primary/10" : "hover:bg-muted/70",
										)}>
										<span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors", isActive ? "bg-primary text-black" : "bg-muted text-muted-foreground group-hover:text-foreground")}>
											<item.icon className="size-4.5" />
										</span>
										<span className="min-w-0 text-left">
											<span className="block font-semibold leading-5">{item.label}</span>
											<span className="hidden text-xs leading-4 text-muted-foreground lg:block">{item.description}</span>
										</span>
										<ChevronRightIcon className={cn("ml-auto hidden size-4 lg:block", isActive ? "text-gold" : "text-muted-foreground/50")} />
									</Link>
								);
							})}
						</nav>

						<div className="min-w-0">{children}</div>
					</div>
				</div>
			</RoleGuard>
		</ProtectedLayout>
	);
}
