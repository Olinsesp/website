/*
  Warnings:

  - The `categoria` column on the `InscricaoModalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `divisao` column on the `InscricaoModalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `faixaEtaria` column on the `InscricaoModalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" DROP COLUMN "categoria",
ADD COLUMN     "categoria" TEXT[],
DROP COLUMN "divisao",
ADD COLUMN     "divisao" TEXT[],
DROP COLUMN "faixaEtaria",
ADD COLUMN     "faixaEtaria" TEXT[];
