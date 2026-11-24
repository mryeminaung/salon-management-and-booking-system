import { prisma } from "@/config/db";
import { Role } from "@prisma/constants";
import bcrypt from "bcryptjs";
import { verifySalonAccess } from "./salon-access.service";

interface CreateStaffInput {
	email: string;
	password: string;
	name: string;
	phone: string;
	specialty?: string;
}

interface AssignStaffInput {
	salonId: string;
	specialty?: string;
}

interface UpdateStaffInput {
	name?: string;
	phone?: string;
	specialty?: string;
}

const SALT_ROUNDS = 10;

export const addStaff = async (input: CreateStaffInput, callerRole: string) => {
	// Defense-in-depth: verify caller role even though route middleware checks it
	if (callerRole !== "owner" && callerRole !== "manager") {
		throw new Error("Only owners and managers can create staff");
	}

	const { email, password, name, phone, specialty } = input;

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
				role: Role.STAFF,
			},
		});

		await tx.staff.create({
			data: {
				userId: newUser.id,
				specialty,
			},
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

export const listStaff = async (userId: string, role: string) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error("User not found");
	}

	if (role === "manager") {
		// Manager sees staff from their assigned salon only
		const managerProfile = await prisma.manager.findUnique({ where: { userId } });
		if (!managerProfile?.salonId) {
			return []; // Manager not assigned to a salon yet
		}

		return prisma.staff.findMany({
			where: { salonId: managerProfile.salonId },
			include: {
				user: { select: { id: true, name: true, email: true, phone: true } },
				salon: { select: { id: true, name: true } },
			},
			orderBy: { createdAt: "desc" },
		});
	}

	// Owner sees unassigned staff + staff from all their salons
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

	return prisma.staff.findMany({
		where: {
			OR: [
				{ salonId: null },
				{ salonId: { in: salonIds } },
			],
		},
		include: {
			user: { select: { id: true, name: true, email: true, phone: true } },
			salon: { select: { id: true, name: true } },
		},
		orderBy: { createdAt: "desc" },
	});
};

export const getMyStaffProfile = async (userId: string) => {
	const staff = await prisma.staff.findUnique({
		where: { userId },
		select: {
			id: true,
			specialty: true,
			isActive: true,
			createdAt: true,
			salon: {
				select: {
					id: true,
					name: true,
					address: true,
					phone: true,
				},
			},
		},
	});

	if (!staff) {
		throw new Error("Staff profile not found");
	}

	return staff;
};

export const getStaffById = async (staffId: string, userId: string) => {
	const staff = await prisma.staff.findUnique({
		where: { id: staffId },
		include: {
			user: { select: { id: true, name: true, email: true, phone: true } },
			salon: { select: { id: true, name: true } },
		},
	});

	if (!staff) {
		throw new Error("Staff not found");
	}

	if (staff.salonId) {
		await verifySalonAccess(staff.salonId, userId, Role.STAFF);
	}

	return staff;
};

export const assignStaff = async (
	staffId: string,
	input: AssignStaffInput,
	userId: string,
) => {
	const { salonId, specialty } = input;

	await verifySalonAccess(salonId, userId, Role.OWNER);

	const staff = await prisma.staff.findUnique({
		where: { id: staffId },
	});

	if (!staff) {
		throw new Error("Staff not found");
	}

	if (staff.salonId && staff.salonId !== salonId) {
		throw new Error("Staff is already assigned to another salon");
	}

	await prisma.staff.update({
		where: { id: staffId },
		data: { salonId, ...(specialty !== undefined && { specialty }) },
	});

	return { message: "Staff assigned successfully" };
};

export const getSalonStaff = async (
	salonId: string,
	userId: string,
	role: string,
) => {
	await verifySalonAccess(salonId, userId, role);

	return prisma.staff.findMany({
		where: { salonId },
		include: {
			user: { select: { id: true, name: true, email: true, phone: true } },
		},
		orderBy: { createdAt: "desc" },
	});
};

export const updateStaff = async (
	staffId: string,
	userId: string,
	role: string,
	input: UpdateStaffInput,
) => {
	const staff = await prisma.staff.findUnique({
		where: { id: staffId },
	});

	if (!staff) {
		throw new Error("Staff not found");
	}

	if (staff.salonId) {
		await verifySalonAccess(staff.salonId, userId, role);
	}

	const { name, phone, specialty } = input;

	const updated = await prisma.$transaction(async (tx) => {
		if (name || phone !== undefined) {
			await tx.user.update({
				where: { id: staff.userId },
				data: { ...(name && { name }), ...(phone !== undefined && { phone }) },
			});
		}

		if (specialty !== undefined) {
			await tx.staff.update({
				where: { id: staffId },
				data: { specialty },
			});
		}

		return tx.staff.findUnique({
			where: { id: staffId },
			include: {
				user: { select: { id: true, name: true, email: true, phone: true } },
			},
		});
	});

	return updated;
};

export const removeStaff = async (
	staffId: string,
	userId: string,
	role: string,
) => {
	const staff = await prisma.staff.findUnique({
		where: { id: staffId },
	});

	if (!staff) {
		throw new Error("Staff not found");
	}

	if (staff.salonId) {
		await verifySalonAccess(staff.salonId, userId, role);
	}

	await prisma.$transaction(async (tx) => {
		await tx.staff.delete({ where: { id: staffId } });
		await tx.user.delete({ where: { id: staff.userId } });
	});

	return { message: "Staff removed successfully" };
};
