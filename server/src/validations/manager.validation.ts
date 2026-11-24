import { z } from "zod";

export const createManagerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
  }),
});

export const updateManagerSchema = z.object({
  body: z.object({
    phone: z.string().min(1, "Phone is required").optional(),
    address: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid manager ID"),
  }),
});

export const assignManagerSchema = z.object({
  body: z.object({
    salonId: z.string().uuid("Invalid salon ID"),
  }),
});
