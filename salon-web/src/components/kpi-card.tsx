import type { ComponentType, ReactNode } from "react";
import { cn } from "cn";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
	title: string;
	value: ReactNode;
	description: string;
	icon: ComponentType<{ className?: string }>;
	className?: string;
}

export function KpiCard({
	title,
	value,
	description,
	icon: Icon,
	className,
}: KpiCardProps) {
	return (
		<Card className={cn("ring-gold/20", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-base font-semibold text-foreground">
					{title}
				</CardTitle>
				<Icon className="size-6 text-gold" />
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold tabular-nums text-foreground">{value}</div>
				<p className="mt-1 text-sm text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
