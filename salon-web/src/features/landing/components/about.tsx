import { CalendarCheck, Search, Sparkles } from "lucide-react";

const steps = [
	{
		number: "01",
		icon: Search,
		title: "Discover",
		description: "Browse salons, services, and artists that match your needs.",
	},
	{
		number: "02",
		icon: CalendarCheck,
		title: "Choose your time",
		description: "See availability clearly and pick the moment that works for you.",
	},
	{
		number: "03",
		icon: Sparkles,
		title: "Feel your best",
		description: "Arrive confident, with every detail already taken care of.",
	},
];

export function About() {
	return (
		<section id="experience" className="px-4 py-6 sm:px-6">
			<div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#c9a82f] text-[#17160f]">
				<div className="grid gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-16">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#17160f]/60">How it works</p>
						<h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
							Less planning. More feeling good.
						</h2>
						<p className="mt-5 max-w-sm text-sm leading-7 text-[#17160f]/70 sm:text-base">
							SalonHub brings discovery, trust, and scheduling into one beautifully simple experience.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						{steps.map((step) => (
							<div key={step.number} className="flex min-h-64 flex-col rounded-3xl bg-[#17160f] p-6 text-white">
								<div className="flex items-center justify-between">
									<span className="text-xs tracking-[0.18em] text-white/45">{step.number}</span>
									<step.icon className="size-5 text-[#e2c553]" />
								</div>
								<div className="mt-auto">
									<h3 className="text-xl font-semibold">{step.title}</h3>
									<p className="mt-3 text-sm leading-6 text-white/60">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
