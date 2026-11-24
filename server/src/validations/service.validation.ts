import { z } from "zod";

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    duration: z.number().int().positive("Duration must be a positive integer (minutes)"),
  }),
});

export const assignServiceSchema = z.object({
  body: z.object({
    salonId: z.string().uuid("Invalid salon ID"),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    duration: z.number().int().positive().optional(),
  }),
});
