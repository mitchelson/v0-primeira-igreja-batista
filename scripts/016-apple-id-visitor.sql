-- Apple Sign In + role visitor para novos usuários mobile/web
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id) WHERE apple_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(lower(trim(email))) WHERE email IS NOT NULL;
