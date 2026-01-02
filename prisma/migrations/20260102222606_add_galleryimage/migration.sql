/*
  Warnings:

  - Added the required column `category` to the `GalleryImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
