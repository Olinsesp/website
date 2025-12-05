/*
  Warnings:

  - You are about to drop the column `dadosExtras` on the `Inscricao` table. All the data in the column will be lost.
  - You are about to drop the column `dadosExtras` on the `InscricaoModalidade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Inscricao" DROP COLUMN "dadosExtras";

-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" DROP COLUMN "dadosExtras";
