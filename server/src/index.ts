import "dotenv/config";

import { errorHandler } from "@/middleware/error.middleware";
import authRoutes from "@/routes/auth.routes";
import salonRoutes from "@/routes/salon.routes";
import managerRoutes from "@/routes/manager.routes";
import staffRoutes from "@/routes/staff.routes";
import serviceRoutes from "@/routes/service.routes";
import customerRoutes from "@/routes/customer.routes";
import appointmentRoutes from "@/routes/appointment.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:3000",
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
	res.json({
		success: true,
		message: "Server is running",
		timestamp: new Date().toISOString(),
	});
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/appointments", appointmentRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
