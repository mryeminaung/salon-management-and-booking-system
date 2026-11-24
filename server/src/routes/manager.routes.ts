import {
	assignManager,
	createManager,
	deleteManager,
	getManagerById,
	listManagers,
	updateManager,
} from "@/controllers/manager.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { assignManagerSchema, createManagerSchema, updateManagerSchema } from "@/validations";
import { Router } from "express";

const router = Router();

// POST /api/managers - Create a new manager user (OWNER only)
router.post(
	"/",
	authenticate,
	authorize("owner"),
	validate(createManagerSchema),
	createManager,
);

// GET /api/managers - List all managers (OWNER only)
router.get("/", authenticate, authorize("owner"), listManagers);

// GET /api/managers/:id - Get manager details (OWNER + MANAGER)
router.get("/:id", authenticate, authorize("owner", "manager"), getManagerById);

// PUT /api/managers/:id - Update manager info (OWNER only)
router.put(
	"/:id",
	authenticate,
	authorize("owner"),
	validate(updateManagerSchema),
	updateManager,
);

// PUT /api/managers/:id/assign - Assign manager to salon (OWNER only)
router.put(
	"/:id/assign",
	authenticate,
	authorize("owner"),
	validate(assignManagerSchema),
	assignManager,
);

// DELETE /api/managers/:id - Delete unassigned manager (OWNER only)
router.delete("/:id", authenticate, authorize("owner"), deleteManager);

export default router;
