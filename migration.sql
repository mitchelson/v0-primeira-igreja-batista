CREATE TABLE IF NOT EXISTS evento_modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  tipo TEXT DEFAULT 'Culto',
  horario TIME,
  descricao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evento_posicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  modelo_id UUID REFERENCES evento_modelos(id) ON DELETE CASCADE,
  ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
  funcao TEXT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (evento_id IS NOT NULL OR modelo_id IS NOT NULL)
);

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS modelo_id UUID REFERENCES evento_modelos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_evento_posicoes_evento ON evento_posicoes(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_posicoes_modelo ON evento_posicoes(modelo_id);
CREATE INDEX IF NOT EXISTS idx_evento_posicoes_ministerio ON evento_posicoes(ministerio_id);
