-- ============================================================
-- MIGRAÇÃO COMPLETA — Sistema de Membros/Escalas PIB Roraima
-- Cole tudo de uma vez no SQL Editor do Neon
-- Seguro para rodar múltiplas vezes (IF NOT EXISTS / IF EXISTS)
-- ============================================================

-- ============================================================
-- 1. NOVAS TABELAS
-- ============================================================

-- Users (autenticação Google + perfil)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  foto_url TEXT,
  telefone TEXT,
  role TEXT NOT NULL DEFAULT 'membro',
  permite_escala_multipla BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_login_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Ministérios
CREATE TABLE IF NOT EXISTS ministerios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  cor TEXT DEFAULT '#D4C5B0',
  icone TEXT DEFAULT '⛪',
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vínculo membro ↔ ministério
CREATE TABLE IF NOT EXISTS ministerio_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_lider BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ministerio_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_min_mem_ministerio ON ministerio_membros(ministerio_id);
CREATE INDEX IF NOT EXISTS idx_min_mem_user ON ministerio_membros(user_id);

-- Eventos
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  horario TIME,
  descricao TEXT,
  tipo TEXT DEFAULT 'Culto',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data DESC);

-- Escalas (quem toca/serve em qual evento)
CREATE TABLE IF NOT EXISTS escalas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  funcao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (evento_id, user_id, ministerio_id)
);

CREATE INDEX IF NOT EXISTS idx_escalas_evento ON escalas(evento_id);
CREATE INDEX IF NOT EXISTS idx_escalas_user ON escalas(user_id);
CREATE INDEX IF NOT EXISTS idx_escalas_ministerio ON escalas(ministerio_id);

-- ============================================================
-- 2. COLUNA NOVA EM VISITANTES (FK para users)
-- ============================================================

ALTER TABLE visitantes
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_visitantes_user_id ON visitantes(user_id);

-- ============================================================
-- 3. MIGRAR RESPONSÁVEIS → USERS + MINISTÉRIO INTEGRAÇÃO
-- ============================================================

-- Cria o ministério Integração (se não existir)
INSERT INTO ministerios (nome, descricao, cor, icone, ordem)
VALUES ('Integracao', 'Acompanhamento e envio de mensagens para visitantes', '#10b981', '🤝', 1)
ON CONFLICT (nome) DO NOTHING;

-- Para cada responsável existente:
--   1. Cria um user com email placeholder
--   2. Vincula ao ministério Integração
--   3. Espelha o user_id nos visitantes que ele acompanha
DO $$
DECLARE
  r RECORD;
  v_user_id UUID;
  v_integracao_id UUID;
  v_placeholder_email TEXT;
  v_slug TEXT;
BEGIN
  -- Pega o ID do ministério Integração
  SELECT id INTO v_integracao_id FROM ministerios WHERE nome = 'Integracao';

  FOR r IN SELECT id, nome FROM responsaveis ORDER BY nome
  LOOP
    -- Gera slug simples do nome
    v_slug := lower(regexp_replace(r.nome, '[^a-zA-Z0-9]', '.', 'g'));
    v_placeholder_email := 'pendente.' || left(r.id::text, 8) || '.' || v_slug || '@pib-integracao.local';

    -- Cria user se não existe
    INSERT INTO users (email, nome, role, ativo)
    VALUES (v_placeholder_email, r.nome, 'membro', true)
    ON CONFLICT (email) DO NOTHING;

    -- Pega o ID do user (criado agora ou já existente)
    SELECT id INTO v_user_id FROM users WHERE email = v_placeholder_email;

    -- Vincula ao ministério Integração
    INSERT INTO ministerio_membros (ministerio_id, user_id, is_lider)
    VALUES (v_integracao_id, v_user_id, false)
    ON CONFLICT (ministerio_id, user_id) DO NOTHING;

    -- Espelha user_id nos visitantes deste responsável
    UPDATE visitantes
    SET user_id = v_user_id
    WHERE responsavel_id = r.id AND user_id IS NULL;
  END LOOP;
END $$;

-- ============================================================
-- 4. VERIFICAÇÃO (rode este SELECT para confirmar)
-- ============================================================

SELECT 'users' AS tabela, count(*) AS total FROM users
UNION ALL
SELECT 'ministerios', count(*) FROM ministerios
UNION ALL
SELECT 'ministerio_membros', count(*) FROM ministerio_membros
UNION ALL
SELECT 'eventos', count(*) FROM eventos
UNION ALL
SELECT 'escalas', count(*) FROM escalas;
