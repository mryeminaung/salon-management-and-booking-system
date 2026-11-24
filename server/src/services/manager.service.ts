import { Role } from "@prisma/constants";
import { prisma } from "@/config/db";
import { verifySalonAccess } from "./salon-access.service";
import bcrypt from "bcryptjs";

interface CreateManagerInput {
	email: string;
	password: string;
	name: string;
	phone: string;
}

interface UpdateManagerInput {
	phone?: string;
	address?: string;
}

interface AssignManagerInput {
	salonId: string;
}

const SALT_ROUNDS = 10;

export const createManager = async (input: CreateManagerInput, callerRole: string) => {
	// Defense-in-depth: verify caller role even though route middleware checks it
	if (callerRole !== "owner") {
		throw new Error("Only owners can create managers");
	}

	const { email, password, name, phone } = input;

	// Check if user already exists
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("Email already registered");
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	const user = await prisma.$transaction(async (tx) => {
		const newUser = await tx.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				phone,
				role: Role.MANAGER,
			},
		});

		await tx.manager.create({
			data: { userId: newUser.id },
		});

		return newUser;
	});

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		phone: user.phone,
		role: user.role,
	};
};

export const listManagers = async (userId: string) => {
	// Verify caller is an owner
	const owner = await prisma.owner.findUnique({ where: { userId } });
	if (!owner) {
		throw new Error("Owner profile not found");
	}

	// Get salons owned by this owner
	const salonIds = (
		await prisma.salon.findMany({
			where: { ownerId: owner.id },
			select: { id: true },
		})
	).map((s) => s.id);

	// Get all managers, with salon info
	const managers = await prisma.manager.findMany({
		include: {
			user: { select: { id: true, name: true, email: true, phone: true, address: true, role: true } },
			salon: { select: { id: true, name: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	// Filter to unassigned managers or managers assigned to owner's salons
	return managers.filter(
		(m) => !m.salonId || salonIds.includes(m.salonId),
	);
};

export const getManagerById = async (managerId: string, userId: string) => {
	const manager = await prisma.manager.findUnique({
		where: { id: managerId },
		include: {
			user: { select: { id: true, name: true, email: true, phone: true, address: true, role: true } },
			salon: { select: { id: true, name: true, ownerId: true } },
		},
	});

	if (!manager) {
		throw new Error("Manager not found");
	}

	// If assigned to a salon, verify the salon belongs to the caller
	if (manager.salon) {
		const role = (await prisma.user.findUnique({ where: { id: userId } }))?.role;
		if (role === Role.OWNER) {
			const owner = await prisma.owner.findUnique({ where: { userId } });
			if (!owner || manager.salon.ownerId !== owner.id) {
				throw new Error("Manager not found");
			}
		} else if (role === Role.MANAGER) {
			// Managers can only view themselves
			const callerManager = await prisma.manager.findUnique({ where: { userId } });
			if (!callerManager || callerManager.id !== managerId) {
				throw new Error("Manager not found");
			}
		}
	}

	return manager;
};

export const updateManager = async (
	managerId: string,
	input: UpdateManagerInput,
	userId: string,
) => {
	// Verify caller is an owner
	const owner = await prisma.owner.findUnique({ where: { userId } });
	if (!owner) {
		throw new Error("Owner profile not found");
	}

	const manager = await prisma.manager.findUnique({
		where: { id: managerId },
		include: { user: true, salon: { select: { id: true, name: true } } },
	});

	if (!manager) {
		throw new Error("Manager not found");
	}

	const updatedUser = await prisma.user.update({
		where: { id: manager.userId },
		data: {
			...(input.phone !== undefined && { phone: input.phone }),
			...(input.address !== undefined && { address: input.address }),
		},
	});

	return {
		id: manager.id,
		userId: updatedUser.id,
		salonId: manager.salonId,
		user: {
			id: updatedUser.id,
			name: updatedUser.name,
			email: updatedUser.email,
			phone: updatedUser.phone,
			address: updatedUser.address,
			role: updatedUser.role,
		},
		salon: manager.salon ?? undefined,
	};
};

export const assignManager = async (
	managerId: string,
	salonId: string,
	userId: string,
) => {
	// Verify salon access
	await verifySalonAccess(salonId, userId, Role.OWNER);

	// Verify manager exists
	const manager = await prisma.manager.findUnique({
		where: { id: managerId },
	});

	if (!manager) {
		throw new Error("Manager not found");
	}

	// Check if manager is already assigned to another salon
	if (manager.salonId && manager.salonId !== salonId) {
		throw new Error("Manager is already assigned to another salon");
	}

	// Unassign any existing manager from this salon
	const salon = await prisma.salon.findUnique({ where: { id: salonId } });
	if (salon?.managerId) {
		await prisma.manager.update({
			where: { id: salon.managerId },
			data: { salonId: null },
		});
	}

	// Assign manager to salon
	await prisma.$transaction(async (tx) => {
		await tx.manager.update({
			where: { id: managerId },
			data: { salonId },
		});

		await tx.salon.update({
			where: { id: salonId },
			data: { managerId },
		});
	});

	return { message: "Manager assigned successfully" };
};

export const deleteManager = async (managerId: string, userId: string) => {
	// Verify caller is an owner
	const owner = await prisma.owner.findUnique({ where: { userId } });
	if (!owner) {
		throw new Error("Owner profile not found");
	}

	const manager = await prisma.manager.findUnique({
		where: { id: managerId },
		include: { user: true },
	});

	if (!manager) {
		throw new Error("Manager not found");
	}

	// Only allow deleting unassigned managers
	if (manager.salonId) {
		throw new Error("Cannot delete an assigned manager. Unassign first.");
	}

	await prisma.$transaction(async (tx) => {
		await tx.manager.delete({ where: { id: managerId } });
		await tx.user.delete({ where: { id: manager.userId } });
	});

	return { message: "Manager deleted successfully" };
};
