/*
  Warnings:

  - Made the column `message` on table `Inquiry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "eventDate" TIMESTAMP(3),
ALTER COLUMN "message" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
