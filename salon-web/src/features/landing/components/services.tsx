import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets, Flower2, Scissors, Sparkles } from "lucide-react";

const serviceGroups = [
	{
		title: "Cut, colour & finish",
		description: "Thoughtful cuts, luminous colour, and styling shaped around you.",
		meta: "Hair",
		image: "/landing/hair-editorial.png",
		icon: Scissors,
		className: "md:col-span-7",
	},
	{
		title: "Nails, refined",
		description: "Meticulous care, modern colour, and a finish made to last.",
		meta: "Nails",
		image: "/landing/nail-editorial.png",
		icon: Sparkles,
		className: "md:col-span-5",
	},
];

const compactServices = [
	{
		icon: Flower2,
		title: "Skin & facials",
		description: "Restorative rituals for healthy, radiant skin.",
	},
	{
		icon: Droplets,
		title: "Treatments",
		description: "Deep care for strength, shine, and renewal.",
	},
	{
		icon: Sparkles,
		title: "Makeup & events",
		description: "Personal beauty looks for your most memorable moments.",
	},
];

export function Services() {
	return (
		<section id="services" className="border-y border-border/70 bg-card/35 px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div className="max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Curated services</p>
						<h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
							Care for every version of you.
						</h2>
					</div>
					<p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
						Discover specialists who listen first, then create a look that feels unmistakably yours.
					</p>
				</div>

				<div className="mt-12 grid gap-5 md:grid-cols-12">
					{serviceGroups.map((service) => (
						<article
							key={service.title}
							className={`group relative min-h-[32rem] overflow-hidden rounded-[1.75rem] bg-muted ${
								service.className
							}`}>
							<Image
								src={service.image}
								alt={service.title}
								fill
								sizes="(max-width: 768px) 92vw, 58vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white sm:p-8">
								<div>
									<div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/65">
										<service.icon className="size-4 text-[#e6c95b]" />
										{service.meta}
									</div>
									<h3 className="font-serif text-3xl tracking-tight">{service.title}</h3>
									<p className="mt-2 max-w-md text-sm leading-6 text-white/70">{service.description}</p>
								</div>
								<Link
									href="/register"
									aria-label={`Explore ${service.title}`}
									className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-black">
									<ArrowUpRight className="size-4" />
								</Link>
							</div>
						</article>
					))}
				</div>

				<div className="mt-5 grid gap-5 md:grid-cols-3">
					{compactServices.map((service) => (
						<div
							key={service.title}
							className="group rounded-3xl border border-border/70 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5">
							<div className="flex items-start justify-between">
								<span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-gold">
									<service.icon className="size-5" />
								</span>
								<ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</div>
							<h3 className="mt-8 text-lg font-semibold">{service.title}</h3>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
