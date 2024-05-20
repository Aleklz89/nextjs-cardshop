-- CreateTable
CREATE TABLE "CardBalance" (
    "id" SERIAL NOT NULL,
    "cardId" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "CardBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardBalance_cardId_key" ON "CardBalance"("cardId");
