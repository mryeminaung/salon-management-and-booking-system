import { Quote, Star } from "lucide-react";

const testimonials = [
	{
		quote:
			"I found a colourist who understood exactly what I wanted, and booking took less time than making coffee.",
		name: "Maya L.",
		service: "Balayage & finish",
	},
	{
		quote:
			"The whole experience felt thoughtful—from choosing a time to walking out feeling completely renewed.",
		name: "Sophie R.",
		service: "Cut & treatment",
	},
	{
		quote:
			"Finally, one place where I can see the services, the artist, and the availability before I commit.",
		name: "Nora K.",
		service: "Gel manicure",
	},
];

export function Testimonials() {
	return (
		<section className="px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Client notes</p>
						<h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Good hair days, shared.</h2>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex gap-1 text-gold" aria-label="Five star rating">
							{Array.from({ length: 5 }).map((_, index) => (
								<Star key={index} className="size-4 fill-current" />
							))}
						</div>
						<span className="text-sm text-muted-foreground">4.9 average experience</span>
					</div>
				</div>

				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<figure
							key={testimonial.name}
							className={`flex min-h-80 flex-col rounded-[1.75rem] border p-7 sm:p-8 ${
								index === 1
									? "border-primary/30 bg-primary/10"
									: "border-border/70 bg-card/55"
							}`}>
							<Quote className="size-8 text-gold/70" />
							<blockquote className="mt-8 font-serif text-2xl leading-snug tracking-[-0.02em]">
								“{testimonial.quote}”
							</blockquote>
							<figcaption className="mt-auto pt-8">
								<p className="text-sm font-semibold">{testimonial.name}</p>
								<p className="mt-1 text-xs text-muted-foreground">{testimonial.service}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
