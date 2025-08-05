/*
  Warnings:

  - Added the required column `city` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Posts" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
