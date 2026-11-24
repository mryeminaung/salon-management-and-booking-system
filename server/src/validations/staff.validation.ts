import { z } from "zod";

export const addStaffSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    specialty: z.string().optional(),
  }),
});

export const assignStaffSchema = z.object({
  body: z.object({
    salonId: z.string().uuid("Invalid salon ID"),
    specialty: z.string().optional(),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    specialty: z.string().optional(),
  }),
});
