import { create } from "zustand";
import api from "@/lib/axios";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  salonId?: string;
  salon?: { id: string; name: string };
  createdAt: string;
}

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchAllServices: () => Promise<void>;
  fetchSalonServices: (salonId: string) => Promise<void>;
  createService: (data: { name: string; description?: string; price: number; duration: number }) => Promise<void>;
  assignService: (serviceId: string, salonId: string) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchAllServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/services");
      set({ services: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to fetch services", isLoading: false });
    }
  },

  fetchSalonServices: async (salonId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/api/salons/${salonId}/services`);
      set({ services: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to fetch services", isLoading: false });
    }
  },

  createService: async (data) => {
    const res = await api.post("/api/services", data);
    set((s) => ({ services: [res.data.data, ...s.services] }));
  },

  assignService: async (serviceId, salonId) => {
    await api.put(`/api/services/${serviceId}/assign`, { salonId });
  },

  updateService: async (id, data) => {
    const res = await api.put(`/api/services/${id}`, data);
    set((s) => ({
      services: s.services.map((svc) => (svc.id === id ? { ...svc, ...res.data.data } : svc)),
    }));
  },

  deleteService: async (id) => {
    await api.delete(`/api/services/${id}`);
    set((s) => ({ services: s.services.filter((svc) => svc.id !== id) }));
  },
}));
