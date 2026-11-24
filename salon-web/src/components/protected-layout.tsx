"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { NavUser } from "@/components/nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "cn";
import {
	BellIcon,
	BellRingIcon,
	CalendarCheck2Icon,
	CalendarClockIcon,
	CheckCheckIcon,
	CircleDollarSignIcon,
	Clock3Icon,
	MessageSquareMoreIcon,
	PackageSearchIcon,
	Settings2Icon,
	UserRoundPlusIcon,
} from "lucide-react";

const demoNotifications = [
	{ id: 1, icon: CalendarCheck2Icon, title: "New booking confirmed", desc: "Emma Wilson booked a haircut for tomorrow at 10:00 AM.", time: "2 min", unread: true },
	{ id: 2, icon: CalendarClockIcon, title: "Staff schedule updated", desc: "James Chen updated his availability for next week.", time: "15 min", unread: true },
	{ id: 3, icon: CircleDollarSignIcon, title: "Payment received", desc: "You received $85.00 from Sophia Martinez.", time: "1 hr", unread: false },
	{ id: 4, icon: MessageSquareMoreIcon, title: "New review posted", desc: "Liam Johnson left a 5-star review on Hair Coloring.", time: "3 hr", unread: false },
	{ id: 5, icon: PackageSearchIcon, title: "Service stock is low", desc: "Keratin Treatment product is running low.", time: "5 hr", unread: false },
	{ id: 6, icon: UserRoundPlusIcon, title: "New customer registered", desc: "Olivia Brown created an account and browsed your salon.", time: "1 day", unread: false },
];

function ProtectedContentSkeleton() {
	return (
		<div className="w-full max-w-6xl space-y-8" aria-label="Loading page" aria-busy="true">
			<div className="space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-72 max-w-full" /><Skeleton className="h-4 w-96 max-w-full" /></div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)}</div>
			<div className="grid gap-4 lg:grid-cols-7"><Skeleton className="h-80 rounded-2xl lg:col-span-4" /><Skeleton className="h-80 rounded-2xl lg:col-span-3" /></div>
		</div>
	);
}

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const isLoading = useAuthStore((s) => s.isLoading);
	const [scrolled, setScrolled] = useState(false);
	const [notifications, setNotifications] = useState(demoNotifications);

	const unreadCount = notifications.filter((n) => n.unread).length;
	const markAllAsRead = () => {
		setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
	};
	const markAsRead = (id: number) => {
		setNotifications((current) =>
			current.map((notification) => notification.id === id ? { ...notification, unread: false } : notification),
		);
	};

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 0);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!isLoading && !user) return <>{children}</>;

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header
					className={cn(
						"sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 transition-shadow duration-200",
						"bg-background/80 backdrop-blur-lg",
						scrolled && "shadow-sm",
					)}>
					<div className="border rounded-md">
						<SidebarTrigger className="hover:cursor-pointer" />
					</div>
					{isLoading ? <Skeleton className="h-4 w-36" /> : <DashboardBreadcrumb />}
					<div className="ml-auto flex items-center gap-1">
						{isLoading ? (
							<><Skeleton className="size-9 rounded-xl" /><Skeleton className="size-9 rounded-full" /></>
						) : <>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<button
										aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
										className="relative flex size-9 items-center justify-center rounded-xl text-gold transition-colors hover:bg-primary/10 data-popup-open:bg-primary/10"
									/>
								}
							>
								<BellIcon className="size-5" />
								{unreadCount > 0 && (
									<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black ring-2 ring-background">
										{unreadCount}
									</span>
								)}
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								sideOffset={8}
								className="w-[min(24rem,calc(100vw-1rem))] overflow-hidden rounded-2xl p-0 shadow-xl ring-1 ring-gold/20">
								<div className="flex items-center gap-3 border-b border-border/70 px-4 py-4">
									<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold">
										<BellRingIcon className="size-5" />
									</span>
									<div className="min-w-0 flex-1">
										<p className="font-semibold leading-tight">Notifications</p>
										<p className="mt-0.5 text-xs text-muted-foreground">
											{unreadCount > 0 ? `${unreadCount} new update${unreadCount === 1 ? "" : "s"}` : "You’re all caught up"}
										</p>
									</div>
									{unreadCount > 0 && (
										<button
											type="button"
											onClick={markAllAsRead}
											className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-primary/10">
											<CheckCheckIcon className="size-3.5" /> Mark all read
										</button>
									)}
								</div>
								<div className="max-h-96 space-y-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
									{notifications.map((n) => (
										<DropdownMenuItem
											key={n.id}
											onClick={() => markAsRead(n.id)}
											className={cn(
												"relative flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3",
												n.unread && "bg-primary/5",
											)}
										>
											<span className={cn(
												"flex size-9 shrink-0 items-center justify-center rounded-xl",
												n.unread ? "bg-primary/10 text-gold" : "bg-muted text-muted-foreground",
											)}>
												<n.icon className="size-4" />
											</span>
											<div className="min-w-0 flex-1">
												<div className="flex items-start gap-2">
													<p className={cn("flex-1 text-sm leading-5", n.unread ? "font-semibold" : "font-medium")}>{n.title}</p>
													<span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] text-muted-foreground">
														<Clock3Icon className="size-3" /> {n.time}
													</span>
												</div>
												<p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{n.desc}</p>
											</div>
											{n.unread && <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-gold" />}
										</DropdownMenuItem>
									))}
								</div>
								<div className="border-t border-border/70 p-2">
									<DropdownMenuItem
										nativeButton={false}
										render={<Link href={user?.role === "owner" ? "/admin/settings/notifications" : "/settings/notifications"} />}
										className="flex cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-gold">
										<Settings2Icon className="size-4" /> Notification settings
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						{user && (
							<NavUser
								user={{
									name: user.name,
									email: user.email,
									avatar: "/avatars/user-1.webp",
								}}
							/>
						)}
						</>}
					</div>
				</header>
				<main className="flex-1 p-6 flex justify-center">
					{isLoading ? <ProtectedContentSkeleton /> : <div className="w-full max-w-6xl">{children}</div>}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
