"use client";

import { useEffect, useState } from "react";
import { AlignJustifyIcon, CalendarDaysIcon, Clock3Icon, LoaderCircleIcon, MonitorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormMessage, SettingsPanel } from "./settings-ui";

const STORAGE_KEY = "salon-display-preferences";
const defaults = { density: "comfortable", weekStartsOn: "monday", timeFormat: "12-hour" };
type Preferences = typeof defaults;

const options = {
	density: [{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }],
	weekStartsOn: [{ value: "monday", label: "Monday" }, { value: "sunday", label: "Sunday" }],
	timeFormat: [{ value: "12-hour", label: "12-hour (2:30 PM)" }, { value: "24-hour", label: "24-hour (14:30)" }],
};

function PreferenceSelect({ id, label, description, icon: Icon, value, values, onChange }: { id: string; label: string; description: string; icon: typeof MonitorIcon; value: string; values: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
	const current = values.find((option) => option.value === value)?.label;
	return (
		<div className="grid gap-4 rounded-xl border border-border/70 bg-background/40 p-4 sm:grid-cols-[1fr_14rem] sm:items-center">
			<div className="flex gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-4" /></span><div><Label htmlFor={id} className="font-semibold">{label}</Label><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p></div></div>
			<Select value={value} onValueChange={(nextValue) => nextValue && onChange(nextValue)}><SelectTrigger id={id} className="h-11 w-full px-3"><SelectValue>{current}</SelectValue></SelectTrigger><SelectContent>{values.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
		</div>
	);
}

export function DisplayForm() {
	const [preferences, setPreferences] = useState<Preferences>(defaults);
	const [savedPreferences, setSavedPreferences] = useState<Preferences>(defaults);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		const timer = window.setTimeout(() => {
			try {
				const stored = window.localStorage.getItem(STORAGE_KEY);
				if (!stored) return;
				const parsed = { ...defaults, ...JSON.parse(stored) } as Preferences;
				setPreferences(parsed); setSavedPreferences(parsed);
			} catch { /* Keep safe defaults. */ }
		}, 0);
		return () => window.clearTimeout(timer);
	}, []);
	const update = (key: keyof Preferences, value: string) => { setPreferences((current) => ({ ...current, [key]: value })); setSaved(false); };
	const isDirty = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);
	const save = () => { setSaving(true); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); setSavedPreferences(preferences); window.setTimeout(() => { setSaving(false); setSaved(true); }, 250); };

	return (
		<SettingsPanel icon={MonitorIcon} title="Display" description="Fine-tune how schedules and workspace information are shown." footer={
			<><div className="min-h-5">{saved && <FormMessage type="success">Display preferences saved.</FormMessage>}</div><Button type="button" size="lg" className="min-w-32" onClick={save} disabled={!isDirty || saving}>{saving && <LoaderCircleIcon className="animate-spin" />}{saving ? "Saving" : "Save changes"}</Button></>
		}>
			<div className="space-y-3">
				<PreferenceSelect id="display-density" icon={AlignJustifyIcon} label="Interface density" description="Choose how much information fits on a page." value={preferences.density} values={options.density} onChange={(value) => update("density", value)} />
				<PreferenceSelect id="week-start" icon={CalendarDaysIcon} label="Start of week" description="Used in calendar and schedule views." value={preferences.weekStartsOn} values={options.weekStartsOn} onChange={(value) => update("weekStartsOn", value)} />
				<PreferenceSelect id="time-format" icon={Clock3Icon} label="Time format" description="Choose how appointment times are displayed." value={preferences.timeFormat} values={options.timeFormat} onChange={(value) => update("timeFormat", value)} />
			</div>
			<p className="mt-4 text-xs leading-5 text-muted-foreground">These preferences are stored in this browser.</p>
		</SettingsPanel>
	);
}
