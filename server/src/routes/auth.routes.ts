import { login, logout, me, register, updateProfile, changePassword } from "@/controllers/auth.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { rateLimit } from "@/middleware/rate-limit";
import { validate } from "@/middleware/validate.middleware";
import { loginSchema, registerSchema, updateProfileSchema, changePasswordSchema } from "@/validations";
import { Router } from "express";

const router = Router();

// POST /api/auth/register - Register new user (5 requests per 15 minutes)
router.post("/register", rateLimit(15 * 60 * 1000, 5), validate(registerSchema), register);

// POST /api/auth/login - Login (10 requests per 15 minutes)
router.post("/login", rateLimit(15 * 60 * 1000, 10), validate(loginSchema), login);

// POST /api/auth/logout - Logout
router.post("/logout", logout);

// GET /api/auth/me - Get current user
router.get("/me", authenticate, me);

// PUT /api/auth/profile - Update profile (any authenticated user)
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfile);

// PUT /api/auth/password - Change password (any authenticated user)
router.put("/password", authenticate, validate(changePasswordSchema), changePassword);

export default router;
