-- Migration 013: Repertório
-- Adds repertoire permission columns to eventos and creates repertorio_items table

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS repertorio_ministerio_id UUID REFERENCES ministerios(id) ON DELETE SET NULL;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS repertorio_funcao TEXT;

CREATE TABLE IF NOT EXISTS repertorio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tonalidade TEXT,
  link TEXT,
  observacoes TEXT,
  ordem INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_repertorio_evento ON repertorio_items(evento_id);
