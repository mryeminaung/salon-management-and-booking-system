import { z } from "zod";

const uuid = z.string().uuid();

export const availabilitySchema = z.object({
  params: z.object({ salonId: uuid }),
  query: z.object({
    serviceId: uuid,
    staffId: uuid,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timezoneOffset: z.coerce.number().int().min(-840).max(840),
  }),
});

export const createAppointmentSchema = z.object({
  body: z.object({
    salonId: uuid,
    serviceId: uuid,
    staffId: uuid,
    startAt: z.string().datetime({ offset: true }),
    timezoneOffset: z.number().int().min(-840).max(840),
    notes: z.string().max(500).optional(),
  }),
});

export const appointmentIdSchema = z.object({
  params: z.object({ id: uuid }),
});

export const appointmentStatusSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ status: z.enum(["confirmed", "completed", "cancelled"]) }),
});
