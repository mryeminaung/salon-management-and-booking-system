import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthInitializer } from "@/components/auth-initializer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = localFont({
	src: "../fonts/InstrumentSans.ttf",
	variable: "--font-instrument-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: "SalonHub",
	description: "Premium hair and beauty salon booking system",
	icons: {
		icon: "/logo.png",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			data-scroll-behavior="smooth"
			className={`${instrumentSans.variable} h-full antialiased`}>
			<body className="min-h-full flex-col">
				<AuthInitializer />
				<TooltipProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						themes={["dark", "white"]}
						disableTransitionOnChange>
						{children}
					</ThemeProvider>
				</TooltipProvider>
			</body>
		</html>
	);
}
