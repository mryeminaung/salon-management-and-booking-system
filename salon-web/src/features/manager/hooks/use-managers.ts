import { create } from "zustand";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export interface Manager {
  id: string;
  userId: string;
  salonId?: string;
  avatar?: string;
  user: { id: string; name: string; email: string; phone: string; address?: string; role?: string };
  salon?: { id: string; name: string };
}

interface ManagerState {
  managers: Manager[];
  isLoading: boolean;
  error: string | null;
  fetchManagers: () => Promise<void>;
  createManager: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  updateManager: (managerId: string, data: { phone: string; address: string }) => Promise<void>;
  assignManager: (managerId: string, salonId: string) => Promise<void>;
  deleteManager: (managerId: string) => Promise<void>;
}

export const useManagerStore = create<ManagerState>((set, get) => ({
  managers: [],
  isLoading: false,
  error: null,

  fetchManagers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/managers");
      set({ managers: res.data.data, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, "Failed to fetch managers"), isLoading: false });
    }
  },

  createManager: async (data) => {
    await api.post("/api/managers", data);
    await get().fetchManagers();
  },

  updateManager: async (managerId, data) => {
    await api.put(`/api/managers/${managerId}`, data);
    await get().fetchManagers();
  },

  assignManager: async (managerId, salonId) => {
    await api.put(`/api/managers/${managerId}/assign`, { salonId });
    await get().fetchManagers();
  },

  deleteManager: async (managerId) => {
    await api.delete(`/api/managers/${managerId}`);
    set((s) => ({ managers: s.managers.filter((m) => m.id !== managerId) }));
  },
}));
