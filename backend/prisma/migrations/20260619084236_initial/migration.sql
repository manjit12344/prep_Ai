/*
  Warnings:

  - You are about to drop the column `response` on the `InterviewResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewResponse" DROP COLUMN "response",
ADD COLUMN     "feedback" TEXT;
