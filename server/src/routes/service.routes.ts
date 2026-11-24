import {
	assignService,
	createService,
	deleteService,
	getServiceById,
	listServices,
	updateService,
} from "@/controllers/service.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { assignServiceSchema, createServiceSchema, updateServiceSchema } from "@/validations";
import { Router } from "express";

const router = Router();

// POST /api/services - Create a new service (OWNER only)
router.post(
	"/",
	authenticate,
	authorize("owner"),
	validate(createServiceSchema),
	createService,
);

// GET /api/services - List all unassigned services (OWNER only)
router.get("/", authenticate, authorize("owner"), listServices);

// GET /api/services/:id - Get service details (OWNER + MANAGER)
router.get("/:id", authenticate, authorize("owner", "manager"), getServiceById);

// PUT /api/services/:id/assign - Assign service to salon (OWNER only)
router.put(
	"/:id/assign",
	authenticate,
	authorize("owner"),
	validate(assignServiceSchema),
	assignService,
);

// PUT /api/services/:id - Update service (OWNER + MANAGER)
router.put(
	"/:id",
	authenticate,
	authorize("owner", "manager"),
	validate(updateServiceSchema),
	updateService,
);

// DELETE /api/services/:id - Delete service (OWNER only)
router.delete("/:id", authenticate, authorize("owner"), deleteService);

export default router;
