/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cardsIds" INTEGER[];

-- DropTable
DROP TABLE "Card";
