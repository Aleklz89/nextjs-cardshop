-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('OWNER', 'HEAD', 'TEAM_LEAD', 'BUYER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'BUYER';
