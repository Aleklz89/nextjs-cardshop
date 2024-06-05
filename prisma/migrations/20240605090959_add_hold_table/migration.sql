/*
  Warnings:

  - Added the required column `userId` to the `Hold` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hold" ADD COLUMN     "userId" INTEGER NOT NULL;
