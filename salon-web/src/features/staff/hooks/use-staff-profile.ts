"use client";

import { useCallback, useEffect, useState } from "react";

import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export interface StaffSelfProfile {
	id: string;
	specialty?: string | null;
	isActive: boolean;
	createdAt: string;
	salon?: {
		id: string;
		name: string;
		address: string;
		phone: string;
	} | null;
}

export function useStaffProfile() {
	const [profile, setProfile] = useState<StaffSelfProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const reload = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await api.get<{ success: boolean; data: StaffSelfProfile }>("/api/staff/me");
			setProfile(response.data.data);
			setError("");
		} catch (loadError) {
			setError(getErrorMessage(loadError, "Could not load staff profile"));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		let active = true;
		api.get<{ success: boolean; data: StaffSelfProfile }>("/api/staff/me")
			.then((response) => {
				if (!active) return;
				setProfile(response.data.data);
				setError("");
			})
			.catch((loadError) => {
				if (active) setError(getErrorMessage(loadError, "Could not load staff profile"));
			})
			.finally(() => {
				if (active) setIsLoading(false);
			});
		return () => { active = false; };
	}, []);

	return { profile, isLoading, error, reload };
}
