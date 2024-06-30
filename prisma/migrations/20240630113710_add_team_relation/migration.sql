/*
  Warnings:

  - The primary key for the `Invite` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Invite_id_seq";
