/*
  Warnings:

  - You are about to drop the column `lotacao` on the `Classificacao` table. All the data in the column will be lost.
  - You are about to drop the column `lotacao` on the `Inscricao` table. All the data in the column will be lost.
  - Added the required column `equipe` to the `Inscricao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Classificacao_lotacao_idx";

-- AlterTable
ALTER TABLE "public"."Classificacao" DROP COLUMN "lotacao",
ADD COLUMN     "equipe" TEXT;

-- AlterTable
ALTER TABLE "public"."Inscricao" DROP COLUMN "lotacao",
ADD COLUMN     "equipe" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Classificacao_equipe_idx" ON "public"."Classificacao"("equipe");
