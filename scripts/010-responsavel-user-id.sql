-- Migration 010: user_id em responsaveis + renomear ministerio

-- 1. Adiciona coluna user_id na tabela responsaveis
ALTER TABLE responsaveis ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_responsaveis_user ON responsaveis(user_id);

-- 2. Vincula responsaveis existentes a users pelo nome
UPDATE responsaveis r
SET user_id = u.id
FROM users u
WHERE r.user_id IS NULL AND u.nome = r.nome;

-- 3. Renomeia ministerio Integracao -> Integração & Comunhão
UPDATE ministerios SET nome = 'Integração & Comunhão' WHERE nome = 'Integracao';
