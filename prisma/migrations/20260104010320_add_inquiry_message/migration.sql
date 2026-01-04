-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "message" TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
