import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
	title: "Sign in — SalonHub",
	description: "Sign in to manage your SalonHub appointments and account.",
};

export default function LoginPage() {
	return <LoginForm />;
}
