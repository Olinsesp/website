/*
  Warnings:

  - The `categoria` column on the `Modalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "categoria",
ADD COLUMN     "categoria" TEXT[];
