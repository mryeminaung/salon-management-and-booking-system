import type { Metadata } from "next";

import {
	About,
	Faq,
	Footer,
	Gallery,
	Hero,
	Navbar,
	NewLetter,
	Services,
	Testimonials,
} from "@/features/landing";

export const metadata: Metadata = {
	title: "SalonHub — Beauty, beautifully booked",
	description:
		"Discover trusted salons, talented artists, and beauty appointments that fit your schedule.",
};

export default function Home() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[52rem] bg-[radial-gradient(circle_at_78%_12%,rgba(212,175,55,0.16),transparent_32%),radial-gradient(circle_at_18%_24%,rgba(139,111,71,0.12),transparent_28%)]"
			/>
			<Navbar />
			<main>
				<Hero />
				<Services />
				<Gallery />
				<About />
				<Testimonials />
				<Faq />
				<NewLetter />
			</main>
			<Footer />
		</div>
	);
}
