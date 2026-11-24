import { prisma } from "@/config/db";

export const listCustomers = async () => {
	const customers = await prisma.customer.findMany({
		include: {
			user: { select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	return customers.map((c) => ({
		id: c.id,
		name: c.user.name,
		email: c.user.email,
		phone: c.user.phone,
		avatar: c.user.avatar,
		createdAt: c.user.createdAt,
	}));
};
