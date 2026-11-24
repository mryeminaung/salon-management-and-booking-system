"use client";

import { useEffect, useState } from "react";
import { BellIcon, CalendarCheck2Icon, LoaderCircleIcon, MailIcon, MegaphoneIcon, ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage, PreferenceToggle, SettingsPanel } from "./settings-ui";

const STORAGE_KEY = "salon-notification-preferences";
const defaults = { bookingUpdates: true, scheduleUpdates: true, securityAlerts: true, productNews: false };
type Preferences = typeof defaults;

export function NotificationsForm() {
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
			} catch { /* Keep safe defaults when browser storage is unavailable. */ }
		}, 0);
		return () => window.clearTimeout(timer);
	}, []);

	const update = (key: keyof Preferences, checked: boolean) => { setPreferences((current) => ({ ...current, [key]: checked })); setSaved(false); };
	const isDirty = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);
	const save = () => {
		setSaving(true);
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
		setSavedPreferences(preferences);
		window.setTimeout(() => { setSaving(false); setSaved(true); }, 250);
	};

	return (
		<SettingsPanel icon={BellIcon} title="Notifications" description="Control which updates deserve your attention." footer={
			<><div className="min-h-5">{saved && <FormMessage type="success">Notification preferences saved.</FormMessage>}</div><Button type="button" size="lg" className="min-w-32" onClick={save} disabled={!isDirty || saving}>{saving && <LoaderCircleIcon className="animate-spin" />}{saving ? "Saving" : "Save changes"}</Button></>
		}>
			<div className="mb-5 rounded-xl border border-primary/15 bg-primary/5 p-4"><p className="font-semibold">Stay informed, not interrupted</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Essential security alerts remain recommended. Preferences are stored in this browser.</p></div>
			<div className="space-y-3">
				<PreferenceToggle icon={CalendarCheck2Icon} label="Booking activity" description="Confirmations, cancellations, and appointment changes." checked={preferences.bookingUpdates} onCheckedChange={(checked) => update("bookingUpdates", checked)} />
				<PreferenceToggle icon={MailIcon} label="Schedule updates" description="Changes to staff schedules, hours, and availability." checked={preferences.scheduleUpdates} onCheckedChange={(checked) => update("scheduleUpdates", checked)} />
				<PreferenceToggle icon={ShieldAlertIcon} label="Security alerts" description="Password changes and important account activity." checked={preferences.securityAlerts} onCheckedChange={(checked) => update("securityAlerts", checked)} />
				<PreferenceToggle icon={MegaphoneIcon} label="Product news" description="Occasional tips, feature releases, and announcements." checked={preferences.productNews} onCheckedChange={(checked) => update("productNews", checked)} />
			</div>
		</SettingsPanel>
	);
}
