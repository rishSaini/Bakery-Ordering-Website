/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `GalleryImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_imageUrl_key" ON "GalleryImage"("imageUrl");
