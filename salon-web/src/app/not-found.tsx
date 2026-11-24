import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
			<Image
				src="/404.svg"
				alt="404"
				width={550}
				height={198}
				priority
			/>

			<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
				Opps!!!
			</h1>
			<p className="mt-3 text-muted-foreground">
				This page you are looking for could not be found.
			</p>
			<Link
				href="/"
				className={buttonVariants({ size: "lg" }) + " mt-8"}>
				Go Back to Home
			</Link>
		</div>
	);
}
