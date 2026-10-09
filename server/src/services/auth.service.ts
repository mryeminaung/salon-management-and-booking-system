import { prisma } from "@/config/db";
import { Role, RoleType } from "@prisma/constants";
import bcrypt from "bcryptjs";
import { generateToken } from "./token-blacklist";

interface RegisterInput {
	email: string;
	password: string;
	name: string;
	phone: string;
	role: RoleType;
}

interface LoginInput {
	email: string;
	password: string;
}

const SALT_ROUNDS = 10;

export const register = async (input: RegisterInput) => {
	const { email, password, name, phone, role } = input;

	// Check if user already exists
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("Invalid email or password");
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	// Create user with role-specific profile in a transaction
	const user = await prisma.$transaction(async (tx) => {
		const newUser = await tx.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				phone,
				role,
			},
		});

		// Create role-specific profile
		switch (role) {
			case Role.OWNER:
				await tx.owner.create({ data: { userId: newUser.id } });
				break;
			case Role.MANAGER:
				await tx.manager.create({ data: { userId: newUser.id } });
				break;
			case Role.STAFF:
				// Staff cannot self-register — they must be created by an owner/manager
				// via the staff management endpoints which handle salon assignment.
				break;
			case Role.CUSTOMER:
				await tx.customer.create({ data: { userId: newUser.id } });
				break;
		}

		return newUser;
	});

	// Generate JWT (used by controller for httpOnly cookie — not sent in response body)
	const token = generateToken({ id: user.id, email: user.email, role: user.role });

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			phone: user.phone,
			role: user.role,
		},
	};
};

export const login = async (input: LoginInput) => {
	const { email, password } = input;

	// Find user
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error("Invalid email or password");
	}

	// Verify password
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new Error("Invalid email or password");
	}

	// Generate JWT (used by controller for httpOnly cookie — not sent in response body)
	const token = generateToken({ id: user.id, email: user.email, role: user.role });

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			phone: user.phone,
			role: user.role,
		},
	};
};

export const getMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			name: true,
			phone: true,
			address: true,
			role: true,
			avatar: true,
			manager: { select: { id: true, salonId: true } },
			staff: { select: { id: true, salonId: true } },
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	return {
		...user,
		salonId: user.manager?.salonId ?? user.staff?.salonId ?? null,
	};
};

interface UpdateProfileInput {
	name?: string;
	phone?: string;
	address?: string;
	avatar?: string;
}

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
	const user = await prisma.user.update({
		where: { id: userId },
		data: {
			...(input.name !== undefined && { name: input.name }),
			...(input.phone !== undefined && { phone: input.phone }),
			...(input.address !== undefined && { address: input.address }),
			...(input.avatar !== undefined && { avatar: input.avatar }),
		},
		select: {
			id: true,
			email: true,
			name: true,
			phone: true,
			address: true,
			role: true,
			avatar: true,
		},
	});

	return user;
};

interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
}

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	const isValid = await bcrypt.compare(input.currentPassword, user.password);
	if (!isValid) throw new Error("Current password is incorrect");

	const hashedPassword = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
	await prisma.user.update({
		where: { id: userId },
		data: { password: hashedPassword },
	});

	return { message: "Password updated successfully" };
};
