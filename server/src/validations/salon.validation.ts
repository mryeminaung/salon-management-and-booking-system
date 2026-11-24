import { z } from "zod";

export const createSalonSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
    description: z.string().min(1, "Description is required"),
    isPublished: z.boolean().optional(),
    openingHours: z.record(z.string()).optional(),
  }),
});

export const updateSalonSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    isPublished: z.boolean().optional(),
    openingHours: z.record(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid salon ID"),
  }),
});
