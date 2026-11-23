"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";

import { useAuthStore, getDefaultRoute } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const user = await login(email, password);
			router.push(getDefaultRoute(user.role));
		} catch (loginError) {
			setError(loginError instanceof Error ? loginError.message : "We couldn't sign you in.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md">
			<div className="grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
				<span className="rounded-full bg-background px-4 py-2.5 text-center font-semibold shadow-sm">
					Sign in
				</span>
				<Link
					href="/register"
					className="rounded-full px-4 py-2.5 text-center text-muted-foreground transition-colors hover:text-foreground">
					Create account
				</Link>
			</div>

			<div className="mt-10">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Welcome back</p>
				<h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Good to see you.</h1>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					Sign in to manage your appointments, team, or salon.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="mt-8 space-y-5">
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium">Email address</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						autoComplete="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						className="h-12 rounded-xl px-4"
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password" className="text-sm font-medium">Password</Label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							autoComplete="current-password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="h-12 rounded-xl px-4 pr-12"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((visible) => !visible)}
							className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							aria-label={showPassword ? "Hide password" : "Show password"}>
							{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
						</button>
					</div>
				</div>

				{error && (
					<div
						role="alert"
						aria-live="polite"
						className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
						<LockKeyhole className="mt-0.5 size-4 shrink-0" />
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={isLoading}
					className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_14px_38px_rgba(212,175,55,0.2)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60">
					{isLoading ? "Signing you in…" : "Sign in"}
					{!isLoading && <ArrowRight className="size-4" />}
				</button>
			</form>

			<p className="mt-7 text-center text-sm text-muted-foreground">
				New to SalonHub?{" "}
				<Link href="/register" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 hover:text-gold">
					Create an account
				</Link>
			</p>
		</div>
	);
}
