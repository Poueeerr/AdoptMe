/*
  Warnings:

  - You are about to drop the column `city` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Posts" DROP COLUMN "city",
DROP COLUMN "neighborhood",
DROP COLUMN "state",
ADD COLUMN     "location_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Locations" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
