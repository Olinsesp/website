/*
  Warnings:

  - You are about to drop the column `orgaoDeOrigem` on the `Equipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Equipe" DROP COLUMN "orgaoDeOrigem";

-- AlterTable
ALTER TABLE "public"."Inscricao" ADD COLUMN     "equipeId" TEXT;

-- CreateIndex
CREATE INDEX "Inscricao_equipeId_idx" ON "public"."Inscricao"("equipeId");

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "public"."Equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
