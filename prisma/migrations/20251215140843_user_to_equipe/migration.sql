/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EquipeRole" AS ENUM ('ADMIN', 'PONTOFOCAL');

-- AlterTable
ALTER TABLE "public"."InscricaoModalidade" ALTER COLUMN "categoria" DROP NOT NULL,
ALTER COLUMN "categoria" SET DATA TYPE TEXT,
ALTER COLUMN "divisao" DROP NOT NULL,
ALTER COLUMN "divisao" SET DATA TYPE TEXT,
ALTER COLUMN "faixaEtaria" DROP NOT NULL,
ALTER COLUMN "faixaEtaria" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."Equipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "orgaoDeOrigem" TEXT NOT NULL,
    "role" "public"."EquipeRole" NOT NULL DEFAULT 'PONTOFOCAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_username_key" ON "public"."Equipe"("username");
