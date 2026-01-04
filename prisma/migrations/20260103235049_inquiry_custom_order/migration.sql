/*
  Warnings:

  - The primary key for the `Inquiry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventDate` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Inquiry` table. All the data in the column will be lost.
  - Added the required column `preferredContactMethod` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('CONTACT', 'CUSTOM_ORDER');

-- AlterTable
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_pkey",
DROP COLUMN "eventDate",
DROP COLUMN "message",
DROP COLUMN "updatedAt",
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "preferredContactMethod" TEXT NOT NULL,
ADD COLUMN     "requestedFor" TIMESTAMP(3),
ADD COLUMN     "type" "InquiryType" NOT NULL DEFAULT 'CONTACT',
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
