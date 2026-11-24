import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types";
import * as serviceService from "@/services/service.service";

export const createService = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const service = await serviceService.createService(req.body);
		res.status(201).json({ success: true, data: service });
	} catch (error) {
		next(error);
	}
};

export const listServices = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const services = await serviceService.listServices(req.user!.id);
		res.json({ success: true, data: services });
	} catch (error) {
		next(error);
	}
};

export const getServiceById = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const service = await serviceService.getServiceById(
			String(req.params.id),
			req.user!.id,
		);
		res.json({ success: true, data: service });
	} catch (error) {
		next(error);
	}
};

export const assignService = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const result = await serviceService.assignService(
			String(req.params.id),
			req.body,
			req.user!.id,
		);
		res.json({ success: true, data: result });
	} catch (error) {
		next(error);
	}
};

export const updateService = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const service = await serviceService.updateService(
			String(req.params.id),
			req.user!.id,
			req.user!.role,
			req.body,
		);
		res.json({ success: true, data: service });
	} catch (error) {
		next(error);
	}
};

export const deleteService = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		await serviceService.deleteService(
			String(req.params.id),
			req.user!.id,
			req.user!.role,
		);
		res.json({ success: true, message: "Service deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const getSalonServices = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const services = await serviceService.getSalonServices(
			String(req.params.salonId),
			req.user!.id,
			req.user!.role,
		);
		res.json({ success: true, data: services });
	} catch (error) {
		next(error);
	}
};
