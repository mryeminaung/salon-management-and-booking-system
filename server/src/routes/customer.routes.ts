import { listCustomers } from "@/controllers/customer.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

// GET /api/customers - List all customers (OWNER only)
router.get("/", authenticate, authorize("owner"), listCustomers);

export default router;
