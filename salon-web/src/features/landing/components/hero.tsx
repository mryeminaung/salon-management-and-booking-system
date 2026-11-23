import Image from "next/image";
import Link from "next/link";
import {
	ArrowDown,
	ArrowRight,
	CalendarDays,
	ShieldCheck,
	Sparkles,
} from "lucide-react";

const promises = [
	{ icon: CalendarDays, label: "Book in minutes" },
	{ icon: ShieldCheck, label: "Trusted professionals" },
	{ icon: Sparkles, label: "Curated services" },
];

export function Hero() {
	return (
		<section className="px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32 lg:pb-36">
			<div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
				<div className="max-w-2xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
						<span className="size-1.5 rounded-full bg-primary" />
						Beauty, beautifully booked
					</div>
					<h1 className="mt-7 max-w-[12ch] font-serif text-5xl leading-[0.94] font-medium tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
						Your time to feel <span className="italic text-gold">remarkable.</span>
					</h1>
					<p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
						Find a salon that gets your style. Explore exceptional artists, compare services,
						and make your next appointment without the back-and-forth.
					</p>

					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/register"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_14px_38px_rgba(212,175,55,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(212,175,55,0.3)]">
							Find your salon <ArrowRight className="size-4" />
						</Link>
						<a
							href="#services"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-6 text-sm font-semibold transition-colors hover:bg-muted">
							Explore services <ArrowDown className="size-4" />
						</a>
					</div>

					<div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/70 pt-6">
						{promises.map((item) => (
							<div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
								<item.icon className="size-4 text-gold" />
								{item.label}
							</div>
						))}
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-[38rem] lg:max-w-none">
					<div className="absolute -inset-5 -z-10 rounded-[2.5rem] border border-primary/20" />
					<div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-[0_30px_100px_rgba(0,0,0,0.24)]">
						<Image
							src="/landing/salon-hero.png"
							alt="A stylist finishing a client's hair in an elegant salon"
							fill
							priority
							sizes="(max-width: 1024px) 92vw, 46vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
						<div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/35 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
							<div>
								<p className="text-xs uppercase tracking-[0.18em] text-white/65">Next available</p>
								<p className="mt-1 font-medium">Today, from 2:30 PM</p>
							</div>
							<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<ArrowRight className="size-4" />
							</span>
						</div>
					</div>
					<div className="absolute -left-4 top-10 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-8">
						<p className="text-2xl font-semibold tracking-tight">4.9</p>
						<p className="text-xs text-muted-foreground">average client rating</p>
					</div>
				</div>
			</div>
		</section>
	);
}
