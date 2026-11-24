"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { navConfig, type Role } from "@/config/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioLinesIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = useAuthStore((s) => s.user);
	const isLoading = useAuthStore((s) => s.isLoading);
	const pathname = usePathname();
	const normalizedRole = user?.role?.toLowerCase() as Role | undefined;
	const navConfigData = normalizedRole ? navConfig[normalizedRole] : null;

	const isActive = (url: string) =>
		pathname === url || pathname.startsWith(url + "/");

	return (
		<Sidebar
			collapsible="icon"
			{...props}>
			<SidebarHeader className="!h-14 !min-h-14 border-b border-border p-0 flex items-center">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							render={
								<Link
									href={
										normalizedRole === "owner"
											? "/admin/dashboard"
											: normalizedRole === "customer"
												? "/salons"
												: "/dashboard"
									}
								/>
							}>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<AudioLinesIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">SalonHub</span>
								{isLoading ? <Skeleton className="mt-1 h-2.5 w-14" /> : <span className="truncate text-xs capitalize text-muted-foreground">{user?.role}</span>}
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="px-2">
				{isLoading ? (
					<>
						{[3, 3].map((itemCount, groupIndex) => (
							<React.Fragment key={groupIndex}>
								{groupIndex > 0 && <SidebarSeparator className="my-1" />}
								<SidebarGroup className="p-0 pt-3">
									<SidebarGroupLabel><Skeleton className="h-2.5 w-16" /></SidebarGroupLabel>
									<SidebarMenu className="gap-1">
										{Array.from({ length: itemCount }).map((_, itemIndex) => (
											<SidebarMenuItem key={itemIndex}>
												<div className="flex h-10 items-center gap-3 rounded-md px-2">
													<Skeleton className="size-5 shrink-0 rounded-md" />
													<Skeleton className="h-3 w-24 group-data-[collapsible=icon]:hidden" />
												</div>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroup>
							</React.Fragment>
						))}
					</>
				) : navConfigData?.groups.map((group, groupIdx) => (
					<React.Fragment key={group.label}>
						{groupIdx > 0 && <SidebarSeparator className="my-1" />}
						<SidebarGroup className="p-0 pt-2">
							<SidebarGroupLabel className="text-xs font-semibold tracking-wider text-primary">
								{group.label}
							</SidebarGroupLabel>
							<SidebarMenu className="gap-1">
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={isActive(item.url)}
											tooltip={item.title}
											render={
												<Link
													className={`flex items-center gap-2 rounded-md px-3 py-5! text-sm font-medium transition-colors ${
														isActive(item.url)
															? "bg-[#FFF8E7]! dark:bg-[#2A2200]! font-semibold border-l-4 border-[#D4AF37]"
															: "hover:bg-muted hover:text-foreground"
													}`}
													href={item.url}
												/>
											}>
											<item.icon className="size-4 shrink-0" />
											<span className="truncate">{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>
					</React.Fragment>
				))}
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
