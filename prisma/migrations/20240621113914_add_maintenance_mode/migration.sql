-- CreateTable
CREATE TABLE "MaintenanceMode" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MaintenanceMode_pkey" PRIMARY KEY ("id")
);
