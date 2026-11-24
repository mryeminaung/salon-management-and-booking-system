import { prisma } from "@/config/db";
import { HttpError } from "@/middleware/http-error";

type BookingInput = {
  salonId: string;
  serviceId: string;
  staffId: string;
  startAt: string;
  timezoneOffset: number;
  notes?: string;
};

const activeStatuses = ["pending", "confirmed"] as const;
const appointmentInclude = {
  customer: { select: { user: { select: { name: true, email: true, phone: true } } } },
} as const;

export const listBookableSalons = () =>
  prisma.salon.findMany({
    where: { isPublished: true, services: { some: { isActive: true } }, staff: { some: { isActive: true } } },
    select: { id: true, name: true, address: true, phone: true, description: true, rating: true, _count: { select: { services: { where: { isActive: true } }, staff: { where: { isActive: true } } } } },
    orderBy: { name: "asc" },
  });

export const getBookableSalon = async (salonId: string) => {
  const salon = await prisma.salon.findFirst({
    where: { id: salonId, isPublished: true },
    select: {
      id: true, name: true, address: true, phone: true, description: true, openingHours: true,
      services: { where: { isActive: true }, select: { id: true, name: true, description: true, price: true, duration: true }, orderBy: { name: "asc" } },
      staff: { where: { isActive: true }, select: { id: true, specialty: true, user: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!salon) throw new HttpError(404, "Salon is not available for booking");
  return salon;
};

const bookingContext = async (salonId: string, serviceId: string, staffId: string) => {
  const [salon, service, staff] = await Promise.all([
    prisma.salon.findFirst({ where: { id: salonId, isPublished: true }, select: { id: true, name: true, openingHours: true } }),
    prisma.service.findFirst({ where: { id: serviceId, salonId, isActive: true }, select: { id: true, name: true, price: true, duration: true } }),
    prisma.staff.findFirst({ where: { id: staffId, salonId, isActive: true }, select: { id: true, user: { select: { name: true } } } }),
  ]);
  if (!salon || !service || !staff) throw new HttpError(400, "Choose an available salon, service, and stylist");
  return { salon, service, staff };
};

const slotsForDate = (date: string, timezoneOffset: number, duration: number, openingHours: unknown) => {
  const [year, month, day] = date.split("-").map(Number);
  const utcDay = new Date(Date.UTC(year, month - 1, day));
  if (utcDay.toISOString().slice(0, 10) !== date) throw new HttpError(400, "Invalid date");
  const weekday = utcDay.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }).toLowerCase();
  const hours = openingHours && typeof openingHours === "object" && !Array.isArray(openingHours)
    ? (openingHours as Record<string, unknown>)[weekday]
    : undefined;
  const range = hours === undefined || hours === "" ? "09:00-18:00" : hours;
  if (range === "closed") return [];
  if (typeof range !== "string") throw new HttpError(400, "Salon hours are unavailable for this date");
  const match = range.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!match) throw new HttpError(400, "Salon hours are unavailable for this date");
  const open = Number(match[1]) * 60 + Number(match[2]);
  const close = Number(match[3]) * 60 + Number(match[4]);
  if (Number(match[2]) > 59 || Number(match[4]) > 59 || open >= close || open >= 24 * 60 || close > 24 * 60) {
    throw new HttpError(400, "Salon hours are unavailable for this date");
  }

  const now = Date.now();
  const max = now + 90 * 24 * 60 * 60 * 1000;
  const slots: Date[] = [];
  for (let minute = open; minute + duration <= close; minute += 30) {
    const start = new Date(Date.UTC(year, month - 1, day, 0, minute) + timezoneOffset * 60_000);
    if (start.getTime() > now && start.getTime() <= max) slots.push(start);
  }
  return slots;
};

export const getAvailability = async (salonId: string, serviceId: string, staffId: string, date: string, timezoneOffset: number) => {
  const { salon, service } = await bookingContext(salonId, serviceId, staffId);
  const slots = slotsForDate(date, timezoneOffset, service.duration, salon.openingHours);
  if (!slots.length) return [];
  const end = new Date(slots[slots.length - 1].getTime() + service.duration * 60_000);
  const bookings = await prisma.appointment.findMany({
    where: { staffId, status: { in: [...activeStatuses] }, startAt: { lt: end }, endAt: { gt: slots[0] } },
    select: { startAt: true, endAt: true },
  });
  return slots.filter((start) => {
    const endAt = start.getTime() + service.duration * 60_000;
    return !bookings.some((booking) => booking.startAt.getTime() < endAt && booking.endAt.getTime() > start.getTime());
  }).map((slot) => slot.toISOString());
};

export const createAppointment = async (userId: string, input: BookingInput) => {
  const customer = await prisma.customer.findUnique({ where: { userId }, select: { id: true } });
  if (!customer) throw new HttpError(403, "Customer account required");
  const { salon, service, staff } = await bookingContext(input.salonId, input.serviceId, input.staffId);
  const startAt = new Date(input.startAt);
  const localDate = new Date(startAt.getTime() - input.timezoneOffset * 60_000).toISOString().slice(0, 10);
  const allowed = slotsForDate(localDate, input.timezoneOffset, service.duration, salon.openingHours);
  if (!allowed.some((slot) => slot.getTime() === startAt.getTime())) throw new HttpError(400, "Choose an available future time slot");
  const endAt = new Date(startAt.getTime() + service.duration * 60_000);

  return prisma.$transaction(async (tx) => {
    // Serialize this customer's bookings and this stylist's bookings before checking overlap.
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(1, hashtext(${customer.id}))`;
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(2, hashtext(${input.staffId}))`;
    const conflict = await tx.appointment.findFirst({
      where: { staffId: input.staffId, status: { in: [...activeStatuses] }, startAt: { lt: endAt }, endAt: { gt: startAt } },
      select: { id: true },
    });
    if (conflict) throw new HttpError(409, "That time is no longer available. Choose another slot.");
    const customerConflict = await tx.appointment.findFirst({
      where: { customerId: customer.id, status: { in: [...activeStatuses] }, startAt: { lt: endAt }, endAt: { gt: startAt } },
      select: { id: true },
    });
    if (customerConflict) throw new HttpError(409, "You already have an appointment at that time.");
    return tx.appointment.create({
      data: {
        customerId: customer.id, salonId: salon.id, serviceId: service.id, staffId: staff.id,
        salonName: salon.name, serviceName: service.name, staffName: staff.user.name,
        price: service.price, startAt, endAt, notes: input.notes?.trim() || null,
      },
    });
  });
};

export const listAppointments = async (userId: string, role: string) => {
  if (role === "customer") {
    const customer = await prisma.customer.findUnique({ where: { userId }, select: { id: true } });
    if (!customer) return [];
    return prisma.appointment.findMany({ where: { customerId: customer.id }, orderBy: { startAt: "desc" }, include: appointmentInclude });
  }
  if (role === "manager") {
    const manager = await prisma.manager.findUnique({ where: { userId }, select: { salonId: true } });
    if (!manager?.salonId) return [];
    return prisma.appointment.findMany({ where: { salonId: manager.salonId }, orderBy: { startAt: "desc" }, include: appointmentInclude });
  }
  if (role === "staff") {
    const staff = await prisma.staff.findUnique({ where: { userId }, select: { id: true } });
    if (!staff) return [];
    return prisma.appointment.findMany({ where: { staffId: staff.id }, orderBy: { startAt: "desc" }, include: appointmentInclude });
  }
  throw new HttpError(403, "Insufficient permissions");
};

export const cancelAppointment = async (userId: string, appointmentId: string) => {
  const customer = await prisma.customer.findUnique({ where: { userId }, select: { id: true } });
  if (!customer) throw new HttpError(403, "Customer account required");
  const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, customerId: customer.id } });
  if (!appointment) throw new HttpError(404, "Appointment not found");
  if (appointment.startAt <= new Date() || !activeStatuses.includes(appointment.status as typeof activeStatuses[number])) {
    throw new HttpError(409, "This appointment can no longer be cancelled");
  }
  const updated = await prisma.appointment.updateMany({
    where: { id: appointmentId, customerId: customer.id, status: appointment.status },
    data: { status: "cancelled" },
  });
  if (!updated.count) throw new HttpError(409, "Appointment status changed. Refresh and try again.");
  return prisma.appointment.findUniqueOrThrow({ where: { id: appointmentId }, include: appointmentInclude });
};

export const updateAppointmentStatus = async (userId: string, appointmentId: string, status: "confirmed" | "completed" | "cancelled") => {
  const manager = await prisma.manager.findUnique({ where: { userId }, select: { salonId: true } });
  if (!manager?.salonId) throw new HttpError(403, "Assigned manager account required");
  const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, salonId: manager.salonId } });
  if (!appointment) throw new HttpError(404, "Appointment not found");
  const valid = (appointment.status === "pending" && ["confirmed", "cancelled"].includes(status))
    || (appointment.status === "confirmed" && ["completed", "cancelled"].includes(status));
  if (!valid) throw new HttpError(409, "This status change is not allowed");
  if (status === "completed" && appointment.startAt > new Date()) throw new HttpError(409, "A future appointment cannot be completed");
  const updated = await prisma.appointment.updateMany({
    where: { id: appointmentId, salonId: manager.salonId, status: appointment.status },
    data: { status },
  });
  if (!updated.count) throw new HttpError(409, "Appointment status changed. Refresh and try again.");
  return prisma.appointment.findUniqueOrThrow({ where: { id: appointmentId }, include: appointmentInclude });
};
