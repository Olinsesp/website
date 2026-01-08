/*
  Warnings:

  - You are about to drop the column `categoria` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `divisao` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `faixaEtaria` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - The `vagasPorEquipe` column on the `Modalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" DROP COLUMN "categoria",
DROP COLUMN "divisao",
DROP COLUMN "faixaEtaria";

-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "vagasPorEquipe",
ADD COLUMN     "vagasPorEquipe" JSONB;
