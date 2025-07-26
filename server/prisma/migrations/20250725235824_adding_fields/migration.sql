/*
  Warnings:

  - Added the required column `title` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL;
