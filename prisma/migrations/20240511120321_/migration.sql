/*
  Warnings:

  - Added the required column `telegram` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "markup" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "telegram" TEXT NOT NULL;
