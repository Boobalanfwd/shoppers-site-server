/*
  Warnings:

  - You are about to drop the column `type` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `isDigital` on the `ProductType` table. All the data in the column will be lost.
  - You are about to drop the column `isShippingRequired` on the `ProductType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Attribute" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "public"."ProductType" DROP COLUMN "isDigital",
DROP COLUMN "isShippingRequired",
ALTER COLUMN "hasVariants" DROP NOT NULL;
