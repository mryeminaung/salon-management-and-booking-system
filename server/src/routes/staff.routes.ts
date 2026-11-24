import {
	addStaff,
	assignStaff,
	getStaffById,
	getMyStaffProfile,
	listStaff,
	removeStaff,
	updateStaff,
} from "@/controllers/staff.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { addStaffSchema, assignStaffSchema, updateStaffSchema } from "@/validations";
import { Router } from "express";

const router = Router();

// POST /api/staff - Create a new staff user (OWNER + MANAGER)
router.post(
	"/",
	authenticate,
	authorize("owner", "manager"),
	validate(addStaffSchema),
	addStaff,
);

// GET /api/staff - List staff (OWNER sees all salons, MANAGER sees assigned salon)
router.get("/", authenticate, authorize("owner", "manager"), listStaff);

// GET /api/staff/me - Authenticated staff member's own profile
router.get("/me", authenticate, authorize("staff"), getMyStaffProfile);

// GET /api/staff/:id - Get staff details (OWNER + MANAGER)
router.get("/:id", authenticate, authorize("owner", "manager"), getStaffById);

// PUT /api/staff/:id/assign - Assign staff to salon (OWNER only)
router.put(
	"/:id/assign",
	authenticate,
	authorize("owner"),
	validate(assignStaffSchema),
	assignStaff,
);

// PUT /api/staff/:id - Update staff details (OWNER + MANAGER)
router.put(
	"/:id",
	authenticate,
	authorize("owner", "manager"),
	validate(updateStaffSchema),
	updateStaff,
);

// DELETE /api/staff/:id - Remove staff (OWNER + MANAGER)
router.delete("/:id", authenticate, authorize("owner", "manager"), removeStaff);

export default router;
