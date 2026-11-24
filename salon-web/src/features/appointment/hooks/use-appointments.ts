"use client";

import { useCallback, useEffect, useState } from "react";

import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

import type { Appointment } from "../types";

export function useAppointments(enabled = true) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const reload = useCallback(async () => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const response = await api.get<{ success: boolean; data: Appointment[] }>("/api/appointments");
			setAppointments(response.data.data);
			setError("");
		} catch (loadError) {
			setError(getErrorMessage(loadError, "Could not load appointments"));
		} finally {
			setIsLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		if (!enabled) return;
		let active = true;
		api.get<{ success: boolean; data: Appointment[] }>("/api/appointments")
			.then((response) => {
				if (!active) return;
				setAppointments(response.data.data);
				setError("");
			})
			.catch((loadError) => {
				if (active) setError(getErrorMessage(loadError, "Could not load appointments"));
			})
			.finally(() => {
				if (active) setIsLoading(false);
			});
		return () => { active = false; };
	}, [enabled]);

	return { appointments, isLoading, error, reload };
}
