-- AlterTable
ALTER TABLE "Inquiry" ALTER COLUMN "preferredContactMethod" SET DEFAULT 'EMAIL';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
