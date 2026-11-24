import { NextFunction, Response } from "express";
import { AuthRequest } from "@/types";
import * as appointments from "@/services/appointment.service";

export const listBookableSalons = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await appointments.listBookableSalons() }); }
  catch (error) { next(error); }
};

export const getBookableSalon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await appointments.getBookableSalon(String(req.params.salonId)) }); }
  catch (error) { next(error); }
};

export const getAvailability = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({ success: true, data: await appointments.getAvailability(
      String(req.params.salonId), String(req.query.serviceId), String(req.query.staffId),
      String(req.query.date), Number(req.query.timezoneOffset),
    ) });
  } catch (error) { next(error); }
};

export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(201).json({ success: true, data: await appointments.createAppointment(req.user!.id, req.body) }); }
  catch (error) { next(error); }
};

export const listAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await appointments.listAppointments(req.user!.id, req.user!.role) }); }
  catch (error) { next(error); }
};

export const cancelAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await appointments.cancelAppointment(req.user!.id, String(req.params.id)) }); }
  catch (error) { next(error); }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await appointments.updateAppointmentStatus(req.user!.id, String(req.params.id), req.body.status) }); }
  catch (error) { next(error); }
};
