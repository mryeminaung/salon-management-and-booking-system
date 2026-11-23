import Link from "next/link";
import { AtSign, Mail, MapPin, Scissors } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const footerLinks = [
	{ label: "Services", href: "#services" },
	{ label: "The experience", href: "#experience" },
	{ label: "Our work", href: "#gallery" },
	{ label: "FAQ", href: "#faq" },
];

export function Footer() {
	return (
		<footer id="contact" className="px-4 pb-6 sm:px-6">
			<div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-card/45 px-6 py-10 sm:px-10">
				<div className="grid gap-12 border-b border-border/70 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_1fr]">
					<div>
						<Link href="/" className="inline-flex items-center gap-3" aria-label="SalonHub home">
							<span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<Scissors className="size-4" />
							</span>
							<span className="text-lg font-semibold tracking-[-0.03em]">SalonHub</span>
						</Link>
						<p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
							A more considered way to discover salons, meet talented professionals, and book beauty.
						</p>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
						<ul className="mt-5 space-y-3">
							{footerLinks.map((link) => (
								<li key={link.href}>
									<a href={link.href} className="text-sm transition-colors hover:text-gold">
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Say hello</p>
						<ul className="mt-5 space-y-4 text-sm">
							<li className="flex items-center gap-3"><Mail className="size-4 text-gold" /> hello@salonhub.com</li>
							<li className="flex items-center gap-3"><MapPin className="size-4 text-gold" /> Find salons near you</li>
							<li className="flex items-center gap-3"><AtSign className="size-4 text-gold" /> @salonhub</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col gap-4 pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>© {new Date().getFullYear()} SalonHub. Beauty, beautifully booked.</p>
					<div className="flex items-center gap-5">
						<Link href="/login" className="transition-colors hover:text-foreground">Sign in</Link>
						<Link href="/register" className="transition-colors hover:text-foreground">Create account</Link>
						<ThemeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
}
