-- Tabela para armazenar resultados dos dons espirituais
CREATE TABLE IF NOT EXISTS user_gift_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  results JSONB NOT NULL, -- Array de {gift: string, score: number, rank: number}
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
