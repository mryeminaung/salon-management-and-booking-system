"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Scissors } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/stores/auth-store";

const navItems = [
	{ label: "Services", href: "#services" },
	{ label: "The experience", href: "#experience" },
	{ label: "Our work", href: "#gallery" },
	{ label: "FAQ", href: "#faq" },
];

export function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const dashboardHref =
		user?.role?.toLowerCase() === "owner" ? "/admin/dashboard" : "/dashboard";

	return (
		<header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
			<div
				className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 transition-all duration-300 sm:px-6 ${
					scrolled
						? "border border-border/70 bg-background/88 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl"
						: "border border-transparent bg-transparent"
				}`}>
				<Link href="/" className="flex items-center gap-3" aria-label="SalonHub home">
					<span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
						<Scissors className="size-4" />
					</span>
					<span className="text-lg font-semibold tracking-[-0.03em]">SalonHub</span>
				</Link>

				<nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="text-sm text-muted-foreground transition-colors hover:text-foreground">
							{item.label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					{isAuthenticated ? (
						<Link
							href={dashboardHref}
							className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
							Dashboard <ArrowUpRight className="size-3.5" />
						</Link>
					) : (
						<>
							<Link
								href="/login"
								className="hidden h-9 items-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex">
								Sign in
							</Link>
							<Link
								href="/register"
								className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
								Get started <ArrowUpRight className="size-3.5" />
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
