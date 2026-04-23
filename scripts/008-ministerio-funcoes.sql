CREATE TABLE IF NOT EXISTS ministerio_funcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ministerio_id, nome)
);

CREATE INDEX IF NOT EXISTS idx_min_funcoes_ministerio ON ministerio_funcoes(ministerio_id);
