/*
  Warnings:

  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "team" TEXT NOT NULL DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'buyer';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "team" TEXT NOT NULL DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'buyer';

-- DropEnum
DROP TYPE "UserStatus";
