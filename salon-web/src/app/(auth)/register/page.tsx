import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
	title: "Create account — SalonHub",
	description: "Create your SalonHub account and find your next salon appointment.",
};

export default function RegisterPage() {
	return <RegisterForm />;
}
