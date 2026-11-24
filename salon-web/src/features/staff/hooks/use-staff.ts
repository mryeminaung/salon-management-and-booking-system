import { create } from "zustand";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export interface Staff {
  id: string;
  userId: string;
  salonId?: string;
  specialty?: string;
  user: { id: string; name: string; email: string; phone?: string };
  salon?: { id: string; name: string };
  createdAt: string;
}

interface StaffState {
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
  fetchAllStaff: () => Promise<void>;
  fetchSalonStaff: (salonId: string) => Promise<void>;
  addStaff: (data: { name: string; email: string; password: string; phone?: string; specialty?: string }) => Promise<void>;
  assignStaff: (staffId: string, salonId: string) => Promise<void>;
  updateStaff: (id: string, data: { name?: string; phone?: string; specialty?: string }) => Promise<void>;
  removeStaff: (id: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchAllStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/staff");
      set({ staff: res.data.data, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, "Failed to fetch staff"), isLoading: false });
    }
  },

  fetchSalonStaff: async (salonId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/api/salons/${salonId}/staff`);
      set({ staff: res.data.data, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, "Failed to fetch staff"), isLoading: false });
    }
  },

  addStaff: async (data) => {
    await api.post("/api/staff", data);
    await get().fetchAllStaff();
  },

  assignStaff: async (staffId, salonId) => {
    await api.put(`/api/staff/${staffId}/assign`, { salonId });
    await get().fetchAllStaff();
  },

  updateStaff: async (id, data) => {
    await api.put(`/api/staff/${id}`, data);
    await get().fetchAllStaff();
  },

  removeStaff: async (id) => {
    await api.delete(`/api/staff/${id}`);
    set((s) => ({ staff: s.staff.filter((st) => st.id !== id) }));
  },
}));
