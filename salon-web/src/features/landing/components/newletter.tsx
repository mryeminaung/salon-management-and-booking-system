import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function NewLetter() {
	return (
		<section className="px-4 py-20 sm:px-6 sm:py-28">
			<div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/25 bg-[#151511] px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-20">
				<div
					aria-hidden
					className="absolute -right-24 -top-32 size-[28rem] rounded-full bg-[#c9a82f]/20 blur-3xl"
				/>
				<div
					aria-hidden
					className="absolute -bottom-48 left-1/4 size-96 rounded-full bg-[#8b6f47]/20 blur-3xl"
				/>
				<div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
					<div className="max-w-3xl">
						<div className="flex size-11 items-center justify-center rounded-full bg-[#c9a82f] text-[#17160f]">
							<Sparkles className="size-5" />
						</div>
						<h2 className="mt-8 font-serif text-4xl leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">
							Your next favourite salon is closer than you think.
						</h2>
						<p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
							Create your account and make every appointment feel effortless from the start.
						</p>
					</div>
					<Link
						href="/register"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#c9a82f] px-6 text-sm font-semibold text-[#17160f] transition-transform hover:-translate-y-0.5">
						Get started <ArrowRight className="size-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
