/*
  Warnings:

  - A unique constraint covering the columns `[telegram]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_key" ON "User"("telegram");
