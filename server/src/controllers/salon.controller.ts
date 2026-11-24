import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import * as salonService from "@/services/salon.service";

export const getUserSalons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salons = await salonService.getUserSalons(req.user!.id, req.user!.role);
    res.json({ success: true, data: salons });
  } catch (error) {
    next(error);
  }
};

export const getSalonById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salon = await salonService.getSalonById(String(req.params.id), req.user!.id, req.user!.role);
    res.json({ success: true, data: salon });
  } catch (error) {
    next(error);
  }
};

export const createSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salon = await salonService.createSalon(req.user!.id, req.body);
    res.status(201).json({ success: true, data: salon });
  } catch (error) {
    next(error);
  }
};

export const updateSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salon = await salonService.updateSalon(
      String(req.params.id),
      req.user!.id,
      req.body
    );
    res.json({ success: true, data: salon });
  } catch (error) {
    next(error);
  }
};

export const deleteSalon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await salonService.deleteSalon(String(req.params.id), req.user!.id);
    res.json({ success: true, message: "Salon deleted successfully" });
  } catch (error) {
    next(error);
  }
};
