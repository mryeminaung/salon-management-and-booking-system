import { Request } from "express";

export interface JwtPayload {
  id: string;
  email: string;
  role: "owner" | "manager" | "staff" | "customer";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
