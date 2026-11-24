import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import * as managerService from "@/services/manager.service";

export const createManager = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const manager = await managerService.createManager(req.body, req.user!.role);
		res.status(201).json({ success: true, data: manager });
	} catch (error) {
		next(error);
	}
};

export const listManagers = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const managers = await managerService.listManagers(req.user!.id);
		res.json({ success: true, data: managers });
	} catch (error) {
		next(error);
	}
};

export const getManagerById = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const manager = await managerService.getManagerById(
			String(req.params.id),
			req.user!.id,
		);
		res.json({ success: true, data: manager });
	} catch (error) {
		next(error);
	}
};

export const updateManager = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const manager = await managerService.updateManager(
			String(req.params.id),
			req.body,
			req.user!.id,
		);
		res.json({ success: true, data: manager });
	} catch (error) {
		next(error);
	}
};

export const assignManager = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const result = await managerService.assignManager(
			String(req.params.id),
			req.body.salonId,
			req.user!.id,
		);
		res.json({ success: true, data: result });
	} catch (error) {
		next(error);
	}
};

export const deleteManager = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		await managerService.deleteManager(String(req.params.id), req.user!.id);
		res.json({ success: true, message: "Manager deleted successfully" });
	} catch (error) {
		next(error);
	}
};
