import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Scissors, ShieldCheck, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[0.92fr_1.08fr]">
			<aside className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col">
				<Image
					src="/landing/salon-hero.png"
					alt="A stylist and client in a warm, elegant salon"
					fill
					priority
					sizes="46vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/80" />

				<div className="relative z-10 flex h-full min-h-screen flex-col p-10 xl:p-14">
					<Link href="/" className="inline-flex w-fit items-center gap-3 text-white" aria-label="SalonHub home">
						<span className="flex size-10 items-center justify-center rounded-full bg-[#c9a82f] text-[#17160f]">
							<Scissors className="size-4" />
						</span>
						<span className="text-lg font-semibold tracking-[-0.03em]">SalonHub</span>
					</Link>

					<div className="mt-auto max-w-xl text-white">
						<div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e3c652]">
							<Sparkles className="size-4" />
							Beauty, beautifully booked
						</div>
						<p className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] xl:text-5xl">
							“Your time to feel remarkable starts here.”
						</p>
						<div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-6 text-sm text-white/70">
							<ShieldCheck className="size-4 text-[#e3c652]" />
							Secure booking for clients, teams, and salon owners.
						</div>
					</div>
				</div>
			</aside>

			<section className="flex min-h-screen flex-col">
				<header className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-14">
					<Link href="/" className="flex items-center gap-3 lg:hidden" aria-label="SalonHub home">
						<span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<Scissors className="size-4" />
						</span>
						<span className="font-semibold tracking-[-0.03em]">SalonHub</span>
					</Link>
					<Link
						href="/"
						className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline-flex">
						<ArrowLeft className="size-4" />
						Back to home
					</Link>
					<div className="ml-auto flex items-center gap-3">
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:hidden">
							<ArrowLeft className="size-3.5" />
							Home
						</Link>
						<ThemeToggle />
					</div>
				</header>

				<main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
					{children}
				</main>

				<footer className="px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
					© {new Date().getFullYear()} SalonHub · Your account is protected with secure sign-in.
				</footer>
			</section>
		</div>
	);
}
