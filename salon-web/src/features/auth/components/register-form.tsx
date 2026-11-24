"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";

import { useAuthStore, getDefaultRoute } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function generatePassword(length = 10): string {
	const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
	const values = new Uint8Array(length);
	crypto.getRandomValues(values);
	return Array.from(values, (value) => characters[value % characters.length]).join("");
}

export default function RegisterForm() {
	const router = useRouter();
	const register = useAuthStore((state) => state.register);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target;
		setFormData((current) => ({ ...current, [id]: value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		if (formData.password.length < 6) {
			setError("Use at least 6 characters for your password.");
			setIsLoading(false);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Your passwords don't match yet.");
			setIsLoading(false);
			return;
		}

		try {
			const { confirmPassword, ...registerData } = formData;
			void confirmPassword;
			const user = await register(registerData);
			router.push(getDefaultRoute(user.role));
		} catch (registerError) {
			setError(
				axios.isAxiosError<{ error?: string }>(registerError)
					? registerError.response?.data?.error || registerError.message
					: registerError instanceof Error
						? registerError.message
						: "We couldn't create your account.",

			);
		} finally {
			setIsLoading(false);
		}
	};

	const createPassword = () => {
		const password = generatePassword();
		setFormData((current) => ({
			...current,
			password,
			confirmPassword: password,
		}));
		setShowPassword(true);
	};

	return (
		<div className="w-full max-w-xl">
			<div className="grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
				<Link
					href="/login"
					className="rounded-full px-4 py-2.5 text-center text-muted-foreground transition-colors hover:text-foreground">
					Sign in
				</Link>
				<span className="rounded-full bg-background px-4 py-2.5 text-center font-semibold shadow-sm">
					Create account
				</span>
			</div>

			<div className="mt-8">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Join SalonHub</p>
				<h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Make time for you.</h1>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					Create your client account to discover salons and manage appointments.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="mt-7 space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium">Full name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Your name"
							autoComplete="name"
							value={formData.name}
							onChange={handleChange}
							className="h-12 rounded-xl px-4"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+1 555 000 0000"
							autoComplete="tel"
							value={formData.phone}
							onChange={handleChange}
							className="h-12 rounded-xl px-4"
							required
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium">Email address</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						autoComplete="email"
						value={formData.email}
						onChange={handleChange}
						className="h-12 rounded-xl px-4"
						required
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between gap-4">
						<Label htmlFor="password" className="text-sm font-medium">Password</Label>
						<button
							type="button"
							onClick={createPassword}
							className="inline-flex items-center gap-1.5 text-xs font-medium text-gold transition-colors hover:text-foreground">
							<RefreshCw className="size-3.5" />
							Generate secure password
						</button>
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="At least 6 characters"
							autoComplete="new-password"
							value={formData.password}
							onChange={handleChange}
							className="h-12 rounded-xl px-4 pr-12"
							minLength={6}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((visible) => !visible)}
							className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							aria-label={showPassword ? "Hide passwords" : "Show passwords"}>
							{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
						</button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
					<Input
						id="confirmPassword"
						type={showPassword ? "text" : "password"}
						placeholder="Repeat your password"
						autoComplete="new-password"
						value={formData.confirmPassword}
						onChange={handleChange}
						className="h-12 rounded-xl px-4"
						minLength={6}
						required
					/>
				</div>

				{error && (
					<div
						role="alert"
						aria-live="polite"
						className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
						<ShieldCheck className="mt-0.5 size-4 shrink-0" />
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={isLoading}
					className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_14px_38px_rgba(212,175,55,0.2)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60">
					{isLoading ? "Creating your account…" : "Create account"}
					{!isLoading && <ArrowRight className="size-4" />}
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link href="/login" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 hover:text-gold">
					Sign in
				</Link>
			</p>
		</div>
	);
}
