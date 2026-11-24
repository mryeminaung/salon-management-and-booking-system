"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, Link2, UserRoundCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalonStore } from "@/features/salon";
import { getErrorMessage } from "@/lib/get-error-message";

import { useManagerStore } from "../hooks/use-managers";

interface ManagerAssignDialogProps {
	managerId: string | null;
	managerName?: string;
	onOpenChange: (open: boolean) => void;
	onAssigned: () => void;
}

function AssignContent({ managerId, managerName, onOpenChange, onAssigned }: Omit<ManagerAssignDialogProps, "managerId"> & { managerId: string }) {
	const [salonId, setSalonId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { salons, fetchSalons } = useSalonStore();
	const assignManager = useManagerStore((state) => state.assignManager);
	const availableSalons = salons.filter((salon) => !salon.managerId);
	const selectedSalon = salons.find((salon) => salon.id === salonId);

	useEffect(() => {
		void fetchSalons();
	}, [fetchSalons]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!salonId) return;
		setIsLoading(true);
		setError("");
		try {
			await assignManager(managerId, salonId);
			onAssigned();
		} catch (submitError) {
			setError(getErrorMessage(submitError, "Unable to assign this manager"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="overflow-hidden p-0 sm:max-w-md [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:top-4">
			<DialogHeader className="border-b border-border/70 px-6 py-4 pr-14 text-left">
				<div className="flex items-start gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-gold"><Link2 className="size-5" /></span>
					<div className="pt-0.5"><DialogTitle className="text-lg font-semibold leading-6">Assign manager</DialogTitle><DialogDescription className="mt-1 leading-5">Choose an available salon for {managerName || "this manager"}.</DialogDescription></div>
				</div>
			</DialogHeader>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4 px-6 py-5">
					{error && <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">{error}</p>}
					<div className="flex items-center gap-3 rounded-xl bg-muted/35 p-3"><span className="flex size-9 items-center justify-center rounded-full bg-background text-gold ring-1 ring-border/70"><UserRoundCog className="size-4" /></span><div><p className="text-sm font-semibold">{managerName || "Manager"}</p><p className="text-xs text-muted-foreground">Ready for salon assignment</p></div></div>
					<div className="space-y-2">
						<Label htmlFor="manager-salon">Available salon</Label>
						<Select value={salonId} onValueChange={(value) => setSalonId(value ?? "")} disabled={availableSalons.length === 0}>
							<SelectTrigger id="manager-salon" className="h-11 w-full rounded-xl"><SelectValue placeholder="Select a salon">{selectedSalon?.name || "Select a salon"}</SelectValue></SelectTrigger>
							<SelectContent>{availableSalons.map((salon) => <SelectItem key={salon.id} value={salon.id}><Building2 className="size-4 text-gold" /> {salon.name}</SelectItem>)}</SelectContent>
						</Select>
						<p className="text-xs leading-5 text-muted-foreground">{availableSalons.length === 0 ? "Every salon already has a manager." : `${availableSalons.length} salon${availableSalons.length === 1 ? " is" : "s are"} available.`}</p>
					</div>
				</div>
				<DialogFooter className="mx-0 mb-0 rounded-none border-t border-border/70 bg-muted/20 px-6 py-3">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 rounded-xl">Cancel</Button>
					<Button type="submit" disabled={isLoading || !salonId} className="h-10 rounded-xl px-5">{isLoading ? "Assigning…" : "Assign manager"}</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

export function ManagerAssignDialog({ managerId, managerName, onOpenChange, onAssigned }: ManagerAssignDialogProps) {
	return <Dialog open={managerId !== null} onOpenChange={onOpenChange}>{managerId && <AssignContent key={managerId} managerId={managerId} managerName={managerName} onOpenChange={onOpenChange} onAssigned={onAssigned} />}</Dialog>;
}
