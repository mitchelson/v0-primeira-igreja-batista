-- Migration 010: app_config
CREATE TABLE IF NOT EXISTS app_config (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
