/*
  Warnings:

  - A unique constraint covering the columns `[telegram]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "telegram" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Request_telegram_key" ON "Request"("telegram");
