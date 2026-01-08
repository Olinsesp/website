-- AlterTable
ALTER TABLE "public"."Modalidade" ADD COLUMN     "vagasPorEquipe" JSONB[] DEFAULT ARRAY[]::JSONB[];
