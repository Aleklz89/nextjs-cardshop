-- CreateTable
CREATE TABLE "CardLock" (
    "id" SERIAL NOT NULL,
    "cardUuid" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardLock_cardUuid_key" ON "CardLock"("cardUuid");
