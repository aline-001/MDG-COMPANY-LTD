-- AddColumn: Add phoneNumber to Order table for contact information
ALTER TABLE "Order" ADD COLUMN "phoneNumber" TEXT;

-- Add comment for the new column
COMMENT ON COLUMN "Order"."phoneNumber" IS 'Customer phone number for pickup coordination';

