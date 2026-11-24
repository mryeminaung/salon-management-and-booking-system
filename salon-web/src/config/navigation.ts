import {
	Calendar,
	LayoutDashboard,
	Scissors,
	Settings,
	Store,
	User,
	UserCog,
	Users,
} from "lucide-react";

export interface NavItem {
	title: string;
	url: string;
	icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

export type Role = "owner" | "manager" | "staff" | "customer";

export interface NavConfig {
	groups: NavGroup[];
}

export const navConfig: Record<Role, NavConfig> = {
	owner: {
		groups: [
			{
				label: "Overview",
				items: [
					{
						title: "Dashboard",
						url: "/admin/dashboard",
						icon: LayoutDashboard,
					},
				],
			},
			{
				label: "Management",
				items: [
					{ title: "Salons", url: "/admin/salons", icon: Scissors },
					{ title: "Managers", url: "/admin/managers", icon: UserCog },
					{ title: "Staff", url: "/admin/staff", icon: Users },
					{ title: "Services", url: "/admin/services", icon: Scissors },
				],
			},
			{
				label: "Other",
				items: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
			},
		],
	},
	manager: {
		groups: [
			{
				label: "Overview",
				items: [
					{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
				],
			},
			{
				label: "Management",
				items: [
					{ title: "Staff", url: "/staff", icon: Users },
					{ title: "Services", url: "/services", icon: Scissors },
					{ title: "Appointments", url: "/appointments", icon: Calendar },
					{ title: "Settings", url: "/settings", icon: Settings },
				],
			},
		],
	},
	staff: {
		groups: [
			{
				label: "Overview",
				items: [
					{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
					{ title: "My Schedule", url: "/schedule", icon: Calendar },
				],
			},
			{
				label: "Account",
				items: [{ title: "Profile", url: "/profile", icon: User }],
			},
		],
	},
	customer: {
		groups: [
			{
				label: "Overview",
				items: [
					{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
				],
			},
			{
				label: "Browse",
				items: [
					{ title: "Salons", url: "/salons", icon: Store },
					{ title: "My Appointments", url: "/appointments", icon: Calendar },
					{ title: "Profile", url: "/profile", icon: User },
				],
			},
		],
	},
};
