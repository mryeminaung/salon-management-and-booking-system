import { prisma } from "@/config/db";
import { Role } from "@prisma/constants";
import { verifySalonAccess } from "./salon-access.service";

interface CreateServiceInput {
	name: string;
	description?: string;
	price: number;
	duration: number;
}

interface AssignServiceInput {
	salonId: string;
}

interface UpdateServiceInput {
	name?: string;
	description?: string;
	price?: number;
	duration?: number;
}

function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export const createService = async (input: CreateServiceInput) => {
	const slug = generateSlug(input.name);
	return prisma.service.create({
		data: {
			...input,
			slug,
		},
	});
};

export const listServices = async (userId: string) => {
	const owner = await prisma.owner.findUnique({ where: { userId } });
	if (!owner) {
		throw new Error("Owner profile not found");
	}

	const salonIds = (
		await prisma.salon.findMany({
			where: { ownerId: owner.id },
			select: { id: true },
		})
	).map((s) => s.id);

	const services = await prisma.service.findMany({
		include: {
			salon: { select: { id: true, name: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	return services.filter(
		(s) => !s.salonId || salonIds.includes(s.salonId),
	);
};

export const getServiceById = async (serviceId: string, userId: string) => {
	const service = await prisma.service.findUnique({
		where: { id: serviceId },
		include: {
			salon: { select: { id: true, name: true } },
		},
	});

	if (!service) {
		throw new Error("Service not found");
	}

	if (service.salonId) {
		await verifySalonAccess(service.salonId, userId, Role.STAFF);
	}

	return service;
};

export const assignService = async (
	serviceId: string,
	input: AssignServiceInput,
	userId: string,
) => {
	const { salonId } = input;

	await verifySalonAccess(salonId, userId, Role.OWNER);

	const service = await prisma.service.findUnique({
		where: { id: serviceId },
	});

	if (!service) {
		throw new Error("Service not found");
	}

	if (service.salonId && service.salonId !== salonId) {
		throw new Error("Service is already assigned to another salon");
	}

	await prisma.service.update({
		where: { id: serviceId },
		data: { salonId },
	});

	return { message: "Service assigned successfully" };
};

export const getSalonServices = async (
	salonId: string,
	userId: string,
	role: string,
) => {
	await verifySalonAccess(salonId, userId, role);

	return prisma.service.findMany({
		where: { salonId },
		orderBy: { createdAt: "desc" },
	});
};

export const updateService = async (
	serviceId: string,
	userId: string,
	role: string,
	input: UpdateServiceInput,
) => {
	const service = await prisma.service.findUnique({
		where: { id: serviceId },
	});

	if (!service) {
		throw new Error("Service not found");
	}

	if (service.salonId) {
		await verifySalonAccess(service.salonId, userId, role);
	}

	return prisma.service.update({
		where: { id: serviceId },
		data: input,
	});
};

export const deleteService = async (
	serviceId: string,
	userId: string,
	role: string,
) => {
	const service = await prisma.service.findUnique({
		where: { id: serviceId },
	});

	if (!service) {
		throw new Error("Service not found");
	}

	if (service.salonId) {
		await verifySalonAccess(service.salonId, userId, role);
	}

	return prisma.service.delete({
		where: { id: serviceId },
	});
};
