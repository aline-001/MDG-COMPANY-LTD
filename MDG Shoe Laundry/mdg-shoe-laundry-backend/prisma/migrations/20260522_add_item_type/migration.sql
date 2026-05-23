-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SHOES', 'BAG');

-- AlterTable - Service
ALTER TABLE "Service" 
ADD COLUMN "category" "ItemType" NOT NULL DEFAULT 'SHOES',
ADD COLUMN "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "quantityLabel" TEXT NOT NULL DEFAULT 'per item';

-- Update existing service price column to basePrice if needed, then drop old price
-- First update basePrice with old price values
UPDATE "Service" SET "basePrice" = "price" WHERE "price" IS NOT NULL;
ALTER TABLE "Service" DROP COLUMN "price";
ALTER TABLE "Service" DROP COLUMN "itemType";
ALTER TABLE "Service" DROP COLUMN "estimatedDays";

-- AlterTable - Order
ALTER TABLE "Order" ADD COLUMN "itemType" "ItemType" NOT NULL DEFAULT 'SHOES';
