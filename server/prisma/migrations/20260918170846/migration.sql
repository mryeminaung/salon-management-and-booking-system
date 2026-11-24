/*
  Warnings:

  - Made the column `phone` on table `Salon` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Salon` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Salon" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;
