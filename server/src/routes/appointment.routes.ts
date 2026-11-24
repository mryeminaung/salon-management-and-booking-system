import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { appointmentIdSchema, appointmentStatusSchema, availabilitySchema, createAppointmentSchema } from "@/validations";
import * as controller from "@/controllers/appointment.controller";

const router = Router();
router.use(authenticate);

router.get("/bookable-salons", authorize("customer"), controller.listBookableSalons);
router.get("/bookable-salons/:salonId", authorize("customer"), controller.getBookableSalon);
router.get("/bookable-salons/:salonId/availability", authorize("customer"), validate(availabilitySchema), controller.getAvailability);

router.get("/", authorize("customer", "manager", "staff"), controller.listAppointments);
router.post("/", authorize("customer"), validate(createAppointmentSchema), controller.createAppointment);
router.patch("/:id/cancel", authorize("customer"), validate(appointmentIdSchema), controller.cancelAppointment);
router.patch("/:id/status", authorize("manager"), validate(appointmentStatusSchema), controller.updateAppointmentStatus);

export default router;
