/*
  Warnings:

  - You are about to drop the column `final` on the `InterviewResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewResult" DROP COLUMN "final",
ADD COLUMN     "averageScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "communicationScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "speedScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "strength" TEXT,
ADD COLUMN     "technicalScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weakness" TEXT;
