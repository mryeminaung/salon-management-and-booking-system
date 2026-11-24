import api from "@/lib/axios";
import { create } from "zustand";

export interface Salon {
	id: string;
	name: string;
	address: string;
	phone: string;
	description: string;
	rating: number;
	isPublished: boolean;
	openingHours?: Record<string, string>;
	ownerId: string;
	managerId?: string;
	createdAt: string;
	manager?: {
		user: { id: string; name: string; email: string; phone?: string };
	};
	_count?: { staff: number; services: number };
}

interface SalonState {
	salons: Salon[];
	isLoading: boolean;
	error: string | null;
	fetchSalons: () => Promise<void>;
	createSalon: (data: {
		name: string;
		address: string;
		phone: string;
		description: string;
		isPublished?: boolean;
		openingHours?: Record<string, string>;
	}) => Promise<void>;
	updateSalon: (id: string, data: Partial<Salon>) => Promise<void>;
	deleteSalon: (id: string) => Promise<void>;
}

export const useSalonStore = create<SalonState>((set) => ({
	salons: [],
	isLoading: false,
	error: null,

	fetchSalons: async () => {
		set({ isLoading: true, error: null });
		try {
			const res = await api.get("/api/salons");
			set({ salons: res.data.data, isLoading: false });
		} catch (err: any) {
			set({
				error: err.response?.data?.error || "Failed to fetch salons",
				isLoading: false,
			});
		}
	},

	createSalon: async (data) => {
		const res = await api.post("/api/salons", data);
		set((s) => ({ salons: [res.data.data, ...s.salons] }));
	},

	updateSalon: async (id, data) => {
		const res = await api.put(`/api/salons/${id}`, data);
		set((s) => ({
			salons: s.salons.map((salon) =>
				salon.id === id ? { ...salon, ...res.data.data } : salon,
			),
		}));
	},

	deleteSalon: async (id) => {
		await api.delete(`/api/salons/${id}`);
		set((s) => ({ salons: s.salons.filter((salon) => salon.id !== id) }));
	},
}));
