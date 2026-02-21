-- Create responsaveis table
CREATE TABLE IF NOT EXISTS responsaveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitantes table with new form fields
CREATE TABLE IF NOT EXISTS visitantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  celular TEXT NOT NULL,
  sexo TEXT,
  cidade TEXT,
  cidade_outra TEXT,
  bairro TEXT,
  faixa_etaria TEXT,
  civil_status TEXT,
  telefone TEXT,
  membro_igreja BOOLEAN DEFAULT FALSE,
  quer_visita BOOLEAN DEFAULT FALSE,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mensagem_enviada BOOLEAN DEFAULT FALSE,
  sem_whatsapp BOOLEAN DEFAULT FALSE,
  responsavel_id UUID REFERENCES responsaveis(id) ON DELETE SET NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_visitantes_data_cadastro ON visitantes(data_cadastro DESC);
CREATE INDEX IF NOT EXISTS idx_visitantes_responsavel_id ON visitantes(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_responsaveis_nome ON responsaveis(nome);
