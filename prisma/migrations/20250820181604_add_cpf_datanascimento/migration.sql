/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Inscricao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Inscricao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `Inscricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inscricao" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "dataNascimento" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_cpf_key" ON "public"."Inscricao"("cpf");
