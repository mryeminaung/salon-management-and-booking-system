import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import * as staffService from "@/services/staff.service";

export const addStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.addStaff(req.body, req.user!.role);
		res.status(201).json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};

export const listStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.listStaff(req.user!.id, req.user!.role);
		res.json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};

export const getMyStaffProfile = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.getMyStaffProfile(req.user!.id);
		res.json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};

export const getStaffById = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.getStaffById(
			String(req.params.id),
			req.user!.id,
		);
		res.json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};

export const assignStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const result = await staffService.assignStaff(
			String(req.params.id),
			req.body,
			req.user!.id,
		);
		res.json({ success: true, data: result });
	} catch (error) {
		next(error);
	}
};

export const updateStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.updateStaff(
			String(req.params.id),
			req.user!.id,
			req.user!.role,
			req.body,
		);
		res.json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};

export const removeStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		await staffService.removeStaff(
			String(req.params.id),
			req.user!.id,
			req.user!.role,
		);
		res.json({ success: true, message: "Staff removed successfully" });
	} catch (error) {
		next(error);
	}
};

export const getSalonStaff = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const staff = await staffService.getSalonStaff(
			String(req.params.salonId),
			req.user!.id,
			req.user!.role,
		);
		res.json({ success: true, data: staff });
	} catch (error) {
		next(error);
	}
};
