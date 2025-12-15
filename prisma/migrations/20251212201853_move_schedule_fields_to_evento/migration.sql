/*
  Warnings:

  - You are about to drop the column `dataFim` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `horario` on the `Modalidade` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `Modalidade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Evento" ADD COLUMN     "horario" TEXT,
ADD COLUMN     "local" TEXT;

-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
DROP COLUMN "horario",
DROP COLUMN "local";
