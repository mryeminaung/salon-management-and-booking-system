export interface BookableSalon {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  rating: number;
  _count: { services: number; staff: number };
}

export interface SalonDetails extends Omit<BookableSalon, "rating" | "_count"> {
  openingHours?: Record<string, string> | null;
  services: { id: string; name: string; description?: string | null; price: string; duration: number }[];
  staff: { id: string; specialty?: string | null; user: { name: string } }[];
}

export interface Appointment {
  id: string;
  salonName: string;
  serviceName: string;
  staffName: string;
  price: string;
  startAt: string;
  endAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string | null;
  customer?: { user: { name: string; email: string; phone: string } };
}

export function apiError(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { error?: string } } }).response;
    if (response?.data?.error) return response.data.error;
  }
  return error instanceof Error ? error.message : fallback;
}
