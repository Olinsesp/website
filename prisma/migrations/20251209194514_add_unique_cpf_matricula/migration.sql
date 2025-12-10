/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Inscricao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matricula]` on the table `Inscricao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_cpf_key" ON "public"."Inscricao"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_matricula_key" ON "public"."Inscricao"("matricula");
