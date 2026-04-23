-- Migration 011: Migrar visitantes.responsavel_id para visitantes.user_id (aponta direto para users)

-- Preenche user_id nos visitantes usando o vínculo responsaveis.user_id
UPDATE visitantes v
SET user_id = r.user_id
FROM responsaveis r
WHERE v.responsavel_id = r.id AND r.user_id IS NOT NULL AND v.user_id IS NULL;
