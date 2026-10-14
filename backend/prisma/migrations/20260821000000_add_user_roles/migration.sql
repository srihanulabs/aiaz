-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "role" NOT NULL DEFAULT 'USER';

-- Align the id default with the schema baseline (drift correction).
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
