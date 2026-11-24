-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_salonId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_salonId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "salonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "salonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
