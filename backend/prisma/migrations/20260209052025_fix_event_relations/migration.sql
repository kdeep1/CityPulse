/*
  Warnings:

  - The values [MODERATOR] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC', 'SPORTS', 'TECH', 'ART', 'BUSINESS', 'EDUCATION', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('USER', 'ADMIN', 'ORGANIZER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "public"."userRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "onlineLink" TEXT,
    "totalTickets" INTEGER NOT NULL,
    "soldTickets" INTEGER NOT NULL DEFAULT 0,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "organizerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Events_organizerId_idx" ON "Events"("organizerId");

-- CreateIndex
CREATE INDEX "Events_status_idx" ON "Events"("status");

-- CreateIndex
CREATE INDEX "Events_category_idx" ON "Events"("category");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
