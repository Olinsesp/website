/*
  Warnings:

  - The `vagasPorEquipe` column on the `Modalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "vagasPorEquipe",
ADD COLUMN     "vagasPorEquipe" JSONB;
