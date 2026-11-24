import { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/client";
import { HttpError } from "./http-error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  if (err instanceof HttpError) {
    res.status(err.status).json({ success: false, error: err.message });
    return;
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const field = (err.meta?.target as string[])?.join(", ") || "field";
        res.status(409).json({
          success: false,
          error: `A record with this ${field} already exists`,
        });
        return;
      }
      case "P2025":
        res.status(404).json({
          success: false,
          error: "Record not found",
        });
        return;
      default:
        res.status(400).json({
          success: false,
          error: "Database error",
        });
        return;
    }
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
};
