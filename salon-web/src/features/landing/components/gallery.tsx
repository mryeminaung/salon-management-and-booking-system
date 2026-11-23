import Image from "next/image";

const editorialImages = [
	{
		src: "/landing/salon-hero.png",
		alt: "A warm, modern salon interior during an appointment",
		label: "The salon experience",
		className: "md:col-span-7 md:row-span-2",
		position: "object-center",
	},
	{
		src: "/landing/hair-editorial.png",
		alt: "Dimensional brunette haircut and styling",
		label: "Cut & colour",
		className: "md:col-span-5",
		position: "object-center",
	},
	{
		src: "/landing/nail-editorial.png",
		alt: "A neutral manicure in progress",
		label: "Nail artistry",
		className: "md:col-span-5",
		position: "object-center",
	},
];

export function Gallery() {
	return (
		<section id="gallery" className="px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The edit</p>
						<h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
							Details make the difference.
						</h2>
					</div>
					<p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:justify-self-end">
						From the consultation to the final mirror check, the best appointments feel considered.
						We help you find salons where craft, comfort, and personal attention come together.
					</p>
				</div>

				<div className="mt-12 grid auto-rows-[19rem] gap-5 md:grid-cols-12">
					{editorialImages.map((image) => (
						<figure
							key={image.label}
							className={`group relative overflow-hidden rounded-[1.75rem] bg-muted ${image.className}`}>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes="(max-width: 768px) 92vw, 58vw"
								className={`object-cover transition-transform duration-700 group-hover:scale-[1.025] ${image.position}`}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
							<figcaption className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-medium text-white backdrop-blur">
								{image.label}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
