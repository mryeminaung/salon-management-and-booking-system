import { Request, Response, NextFunction } from "express";
import * as customerService from "@/services/customer.service";

export const listCustomers = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const customers = await customerService.listCustomers();
		res.json({ success: true, data: customers });
	} catch (error) {
		next(error);
	}
};
