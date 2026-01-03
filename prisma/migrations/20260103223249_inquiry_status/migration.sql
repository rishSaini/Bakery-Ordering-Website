/*
  Warnings:

  - You are about to drop the column `eventDate` on the `Inquiry` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "eventDate",
ADD COLUMN     "resolutionNote" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
