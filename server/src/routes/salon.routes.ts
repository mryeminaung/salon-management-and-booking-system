import {
	createSalon,
	deleteSalon,
	getSalonById,
	getUserSalons,
	updateSalon,
} from "@/controllers/salon.controller";
import { getSalonStaff } from "@/controllers/staff.controller";
import { getSalonServices } from "@/controllers/service.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { createSalonSchema, updateSalonSchema } from "@/validations";
import { Router } from "express";

const router = Router();

// Salon management — OWNER only for create/update/delete
router.use(authenticate);

// GET /api/salons - List salons (OWNER sees own, MANAGER/STAFF see assigned)
router.get("/", getUserSalons);

// POST /api/salons - Create salon (OWNER only)
router.post("/", authorize("owner"), validate(createSalonSchema), createSalon);

// GET /api/salons/:id - Get salon details (OWNER + MANAGER + STAFF)
router.get("/:id", authorize("owner", "manager", "staff"), getSalonById);

// PUT /api/salons/:id - Update salon (OWNER only)
router.put(
	"/:id",
	authorize("owner"),
	validate(updateSalonSchema),
	updateSalon,
);

// DELETE /api/salons/:id - Delete salon (OWNER only)
router.delete("/:id", authorize("owner"), deleteSalon);

// GET /api/salons/:salonId/staff - List salon staff (OWNER + MANAGER)
router.get("/:salonId/staff", authorize("owner", "manager"), getSalonStaff);

// GET /api/salons/:salonId/services - List salon services (OWNER + MANAGER)
router.get("/:salonId/services", authorize("owner", "manager"), getSalonServices);

export default router;
