/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `Inscricao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Inscricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inscricao" ADD COLUMN     "matricula" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_matricula_key" ON "public"."Inscricao"("matricula");
