-- Firebase Auth (email/senha e outros provedores Firebase)
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid) WHERE firebase_uid IS NOT NULL;
