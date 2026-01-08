/*
  Warnings:

  - You are about to drop the column `categoria` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `divisao` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `faixaEtaria` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `InscricaoModalidade` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `divisoes` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `faixaEtaria` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `modalidadesSexo` on the `Modalidade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" DROP COLUMN "categoria",
DROP COLUMN "divisao",
DROP COLUMN "faixaEtaria",
DROP COLUMN "sexo";

-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "categoria",
DROP COLUMN "divisoes",
DROP COLUMN "faixaEtaria",
DROP COLUMN "modalidadesSexo";
