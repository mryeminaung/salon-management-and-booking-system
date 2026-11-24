import { prisma } from "@/config/db";
import { Role } from "@prisma/constants";

/**
 * Verify that a user has access to a salon and return the salonId.
 * - Owner: must own the salon
 * - Manager: must be assigned to the salon
 * - Staff: must be assigned to the salon
 */
export const verifySalonAccess = async (
  salonId: string,
  userId: string,
  role: string,
): Promise<string> => {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === Role.OWNER) {
    const owner = await prisma.owner.findUnique({ where: { userId } });
    if (!owner) throw new Error("Owner profile not found");
    const salon = await prisma.salon.findFirst({
      where: { id: salonId, ownerId: owner.id },
    });
    if (!salon) throw new Error("Salon not found");
    return salon.id;
  }

  if (normalizedRole === Role.MANAGER) {
    const manager = await prisma.manager.findFirst({
      where: { userId, salonId },
    });
    if (!manager) throw new Error("Salon not found");
    return salonId;
  }

  if (normalizedRole === Role.STAFF) {
    const staff = await prisma.staff.findFirst({
      where: { userId, salonId },
    });
    if (!staff) throw new Error("Salon not found");
    return salonId;
  }

  throw new Error("Unauthorized");
};

/**
 * Get the salonId for a manager or staff user (single salon).
 * Returns null for owners (they may have multiple).
 */
export const getUserSalonId = async (
  userId: string,
  role: string,
): Promise<string | null> => {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === Role.MANAGER) {
    const manager = await prisma.manager.findUnique({ where: { userId } });
    return manager?.salonId ?? null;
  }

  if (normalizedRole === Role.STAFF) {
    const staff = await prisma.staff.findFirst({ where: { userId } });
    return staff?.salonId ?? null;
  }

  return null;
};
