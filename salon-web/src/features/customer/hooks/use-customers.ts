import { create } from "zustand";
import api from "@/lib/axios";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoading: false,

  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/api/customers");
      set({ customers: res.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
