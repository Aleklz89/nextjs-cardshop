-- CreateTable
CREATE TABLE "Hold" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL,
    "reverseTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hold_transactionId_key" ON "Hold"("transactionId");
