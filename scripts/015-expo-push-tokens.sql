-- ============================================================
-- Migração 015: Expo Push Tokens (app mobile)
-- ============================================================

CREATE TABLE IF NOT EXISTS expo_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, token)
);

CREATE INDEX IF NOT EXISTS idx_expo_push_tokens_user ON expo_push_tokens(user_id);
