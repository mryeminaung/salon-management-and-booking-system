"use client";

import { Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
	{ value: "dark", label: "Luxe Dark", emoji: "🖤" },
	{ value: "white", label: "White", emoji: "☀️" },
];

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "icon" })}>
				<Palette className="size-4" />
				<span className="sr-only">Change theme</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themes.map((t) => (
					<DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
						<span className="mr-2">{t.emoji}</span>
						{t.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
