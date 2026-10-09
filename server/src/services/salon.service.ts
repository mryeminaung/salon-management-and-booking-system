import { prisma } from "@/config/db";
import { Role } from "@prisma/constants";

interface CreateSalonInput {
  name: string;
  address: string;
  phone: string;
  description: string;
  isPublished?: boolean;
  openingHours?: Record<string, string>;
}

interface UpdateSalonInput {
  name?: string;
  address?: string;
  phone?: string;
  description?: string;
  isPublished?: boolean;
  openingHours?: Record<string, string>;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const getUserSalons = async (userId: string, role: string) => {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === Role.OWNER) {
    const owner = await prisma.owner.findUnique({ where: { userId } });
    if (!owner) return [];

    return prisma.salon.findMany({
      where: { ownerId: owner.id },
      include: {
        manager: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
        _count: { select: { staff: true, services: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (normalizedRole === Role.MANAGER) {
    const manager = await prisma.manager.findUnique({ where: { userId } });
    if (!manager?.salonId) return [];
    return prisma.salon.findMany({
      where: { id: manager.salonId },
      include: {
        manager: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
        _count: { select: { staff: true, services: true } },
      },
    });
  }

  if (normalizedRole === Role.STAFF) {
    const staff = await prisma.staff.findFirst({ where: { userId } });
    if (!staff?.salonId) return [];
    return prisma.salon.findMany({
      where: { id: staff.salonId },
      include: {
        _count: { select: { staff: true, services: true } },
      },
    });
  }

  return [];
};

export const getSalonById = async (salonId: string, userId: string, role: string) => {
  const normalizedRole = role.toLowerCase();
  let where: any = { id: salonId };

  if (normalizedRole === Role.OWNER) {
    const owner = await prisma.owner.findUnique({ where: { userId } });
    if (!owner) throw new Error("Owner profile not found");
    where.ownerId = owner.id;
  } else if (normalizedRole === Role.MANAGER) {
    where.manager = { userId };
  } else if (normalizedRole === Role.STAFF) {
    where.staff = { some: { userId } };
  }

  const salon = await prisma.salon.findFirst({
    where,
    include: {
      manager: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
      staff: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
      services: true,
    },
  });

  if (!salon) {
    throw new Error("Salon not found");
  }

  return salon;
};

export const createSalon = async (userId: string, input: CreateSalonInput) => {
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner) {
    throw new Error("Owner profile not found");
  }

  const slug = generateSlug(input.name);

  return prisma.salon.create({
    data: {
      ...input,
      slug,
      ownerId: owner.id,
    },
  });
};

export const updateSalon = async (
  salonId: string,
  userId: string,
  input: UpdateSalonInput
) => {
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner) {
    throw new Error("Owner profile not found");
  }

  const existing = await prisma.salon.findFirst({
    where: { id: salonId, ownerId: owner.id },
  });

  if (!existing) {
    throw new Error("Salon not found");
  }

  return prisma.salon.update({
    where: { id: salonId },
    data: input,
  });
};

export const deleteSalon = async (salonId: string, userId: string) => {
  const owner = await prisma.owner.findUnique({ where: { userId } });
  if (!owner) {
    throw new Error("Owner profile not found");
  }

  const existing = await prisma.salon.findFirst({
    where: { id: salonId, ownerId: owner.id },
  });

  if (!existing) {
    throw new Error("Salon not found");
  }

  return prisma.salon.delete({
    where: { id: salonId },
  });
};
