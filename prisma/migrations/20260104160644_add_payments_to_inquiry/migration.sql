/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutSessionId]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'PAID', 'FAILED', 'CANCELED', 'REFUNDED');

-- AlterEnum
ALTER TYPE "InquiryType" ADD VALUE 'ORDER';

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "amountCents" INTEGER,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "itemsJson" JSONB,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_stripeCheckoutSessionId_key" ON "Inquiry"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_stripePaymentIntentId_key" ON "Inquiry"("stripePaymentIntentId");
