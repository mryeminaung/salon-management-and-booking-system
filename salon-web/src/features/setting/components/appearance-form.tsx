"use client";

import { useEffect, useState } from "react";
import { CheckIcon, MoonStarIcon, PaletteIcon, SunIcon, WandSparklesIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsPanel } from "./settings-ui";

const themes = [
	{ value: "white", label: "Light", description: "A bright, clean workspace.", icon: SunIcon },
	{ value: "dark", label: "Dark", description: "Low-glare and focused.", icon: MoonStarIcon },
] as const;

function ThemePreview({ variant }: { variant: "white" | "dark" }) {
	const light = variant === "white";
	return (
		<div className={light ? "rounded-xl border border-neutral-200 bg-white p-3" : "rounded-xl border border-neutral-700 bg-[#1a1a1a] p-3"}>
			<div className="flex gap-2">
				<div className={light ? "w-12 rounded-lg bg-neutral-100 p-2" : "w-12 rounded-lg bg-[#252525] p-2"}>
					<div className="size-4 rounded-md bg-[#D4AF37]" />
					<div className={light ? "mt-3 h-1.5 rounded bg-neutral-300" : "mt-3 h-1.5 rounded bg-neutral-600"} />
					<div className={light ? "mt-2 h-1.5 rounded bg-neutral-200" : "mt-2 h-1.5 rounded bg-neutral-700"} />
				</div>
				<div className="flex-1 space-y-2 py-1">
					<div className={light ? "h-2 w-1/2 rounded bg-neutral-800" : "h-2 w-1/2 rounded bg-neutral-200"} />
					<div className={light ? "h-1.5 w-3/4 rounded bg-neutral-200" : "h-1.5 w-3/4 rounded bg-neutral-700"} />
					<div className="grid grid-cols-2 gap-2 pt-2">
						<div className={light ? "h-10 rounded-lg border border-neutral-200 bg-neutral-50" : "h-10 rounded-lg border border-neutral-700 bg-[#2e2e2e]"} />
						<div className={light ? "h-10 rounded-lg border border-neutral-200 bg-neutral-50" : "h-10 rounded-lg border border-neutral-700 bg-[#2e2e2e]"} />
					</div>
				</div>
			</div>
		</div>
	);
}

export function AppearanceForm() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		const timer = window.setTimeout(() => setMounted(true), 0);
		return () => window.clearTimeout(timer);
	}, []);
	const currentTheme = resolvedTheme === "dark" ? "dark" : "white";

	return (
		<SettingsPanel icon={PaletteIcon} title="Appearance" description="Choose a theme that feels comfortable throughout your day.">
			<div className="mb-5 flex gap-3 rounded-xl border border-border/70 bg-muted/25 p-4">
				<WandSparklesIcon className="mt-0.5 size-5 shrink-0 text-gold" />
				<div><p className="font-semibold">Theme preference</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Your choice applies instantly and stays on this device.</p></div>
			</div>
			{!mounted ? (
				<div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-52 rounded-xl" /><Skeleton className="h-52 rounded-xl" /></div>
			) : (
				<div role="radiogroup" aria-label="Color theme" className="grid gap-4 sm:grid-cols-2">
					{themes.map((themeOption) => {
						const active = currentTheme === themeOption.value;
						const Icon = themeOption.icon;
						return (
							<button key={themeOption.value} type="button" role="radio" aria-checked={active} onClick={() => setTheme(themeOption.value)} className={`relative rounded-2xl border p-3 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring/50 ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border/80 hover:border-primary/40 hover:bg-muted/20"}`}>
								<ThemePreview variant={themeOption.value} />
								<div className="flex items-center gap-3 px-1 pb-1 pt-3"><span className={`flex size-9 items-center justify-center rounded-lg ${active ? "bg-primary text-black" : "bg-muted text-muted-foreground"}`}><Icon className="size-4" /></span><div><p className="font-semibold">{themeOption.label}</p><p className="text-xs text-muted-foreground">{themeOption.description}</p></div>{active && <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary text-black"><CheckIcon className="size-3.5" /></span>}</div>
							</button>
						);
					})}
				</div>
			)}
		</SettingsPanel>
	);
}
