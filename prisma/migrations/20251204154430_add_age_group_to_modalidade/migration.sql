-- CreateTable
CREATE TABLE "public"."Modalidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "maxParticipantes" INTEGER NOT NULL,
    "participantesAtuais" INTEGER NOT NULL DEFAULT 0,
    "dataInicio" TEXT,
    "dataFim" TEXT,
    "local" TEXT,
    "horario" TEXT,
    "regras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "premios" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'inscricoes-abertas',
    "divisoes" JSONB,
    "modalidadesSexo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "faixaEtaria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Modalidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscricao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT NOT NULL,
    "sexo" TEXT,
    "camiseta" TEXT NOT NULL,
    "lotacao" TEXT NOT NULL,
    "orgaoOrigem" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dadosExtras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InscricaoModalidade" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "modalidadeId" TEXT NOT NULL,
    "dadosExtras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InscricaoModalidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "detalhes" TEXT,
    "modalidade" TEXT,
    "modalidadeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Classificacao" (
    "id" TEXT NOT NULL,
    "modalidadeId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "posicao" INTEGER NOT NULL,
    "inscricaoId" TEXT,
    "lotacao" TEXT,
    "pontuacao" INTEGER NOT NULL,
    "tempo" TEXT,
    "distancia" TEXT,
    "observacoes" TEXT,
    "atleta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Midia" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titulo" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Midia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InscricaoModalidade_inscricaoId_modalidadeId_key" ON "public"."InscricaoModalidade"("inscricaoId", "modalidadeId");

-- CreateIndex
CREATE INDEX "Evento_inicio_idx" ON "public"."Evento"("inicio");

-- CreateIndex
CREATE INDEX "Evento_modalidadeId_idx" ON "public"."Evento"("modalidadeId");

-- CreateIndex
CREATE INDEX "Classificacao_modalidadeId_idx" ON "public"."Classificacao"("modalidadeId");

-- CreateIndex
CREATE INDEX "Classificacao_inscricaoId_idx" ON "public"."Classificacao"("inscricaoId");

-- CreateIndex
CREATE INDEX "Classificacao_lotacao_idx" ON "public"."Classificacao"("lotacao");

-- CreateIndex
CREATE INDEX "Midia_tipo_idx" ON "public"."Midia"("tipo");

-- CreateIndex
CREATE INDEX "Midia_destaque_idx" ON "public"."Midia"("destaque");

-- AddForeignKey
ALTER TABLE "public"."InscricaoModalidade" ADD CONSTRAINT "InscricaoModalidade_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "public"."Inscricao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InscricaoModalidade" ADD CONSTRAINT "InscricaoModalidade_modalidadeId_fkey" FOREIGN KEY ("modalidadeId") REFERENCES "public"."Modalidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evento" ADD CONSTRAINT "Evento_modalidadeId_fkey" FOREIGN KEY ("modalidadeId") REFERENCES "public"."Modalidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classificacao" ADD CONSTRAINT "Classificacao_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "public"."Inscricao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Classificacao" ADD CONSTRAINT "Classificacao_modalidadeId_fkey" FOREIGN KEY ("modalidadeId") REFERENCES "public"."Modalidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
