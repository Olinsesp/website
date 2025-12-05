/*
  Warnings:

  - The `dadosExtras` column on the `Inscricao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dadosExtras` column on the `InscricaoModalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `divisoes` column on the `Modalidade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Inscricao" DROP COLUMN "dadosExtras",
ADD COLUMN     "dadosExtras" TEXT[];

-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" DROP COLUMN "dadosExtras",
ADD COLUMN     "dadosExtras" TEXT[];

-- AlterTable
ALTER TABLE "public"."Modalidade" DROP COLUMN "divisoes",
ADD COLUMN     "divisoes" TEXT[];
