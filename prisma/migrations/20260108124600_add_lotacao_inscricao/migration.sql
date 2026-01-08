/*
  Warnings:

  - Added the required column `lotacao` to the `Inscricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inscricao" ADD COLUMN     "lotacao" TEXT NOT NULL;
