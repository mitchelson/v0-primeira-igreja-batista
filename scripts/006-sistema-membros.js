import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("=== Migration 006: sistema de membros/ministerios/eventos/escalas ===");

  // USERS (antes responsaveis virava users reais)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      google_id TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      foto_url TEXT,
      telefone TEXT,
      role TEXT NOT NULL DEFAULT 'membro' CHECK (role IN ('admin','lider','membro')),
      permite_escala_multipla BOOLEAN NOT NULL DEFAULT false,
      ativo BOOLEAN NOT NULL DEFAULT true,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
      ultimo_login_em TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`;
  console.log("users ok");

  // MINISTERIOS
  await sql`
    CREATE TABLE IF NOT EXISTS ministerios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome TEXT NOT NULL UNIQUE,
      descricao TEXT,
      cor TEXT DEFAULT '#D4C5B0',
      ativo BOOLEAN NOT NULL DEFAULT true,
      ordem INT NOT NULL DEFAULT 0,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log("ministerios ok");

  // MINISTERIO_MEMBROS
  await sql`
    CREATE TABLE IF NOT EXISTS ministerio_membros (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_lider BOOLEAN NOT NULL DEFAULT false,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (ministerio_id, user_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_min_mem_ministerio ON ministerio_membros(ministerio_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_min_mem_user ON ministerio_membros(user_id)`;
  console.log("ministerio_membros ok");

  // EVENTOS
  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      titulo TEXT NOT NULL,
      data DATE NOT NULL,
      horario TIME,
      descricao TEXT,
      tipo TEXT DEFAULT 'Culto',
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data DESC)`;
  console.log("eventos ok");

  // ESCALAS
  await sql`
    CREATE TABLE IF NOT EXISTS escalas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
      ministerio_id UUID NOT NULL REFERENCES ministerios(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      funcao TEXT,
      status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','confirmado','recusado')),
      observacao TEXT,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // Indice unico parcial - evita duplicar (mesmo evento, ministerio, user, funcao)
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_escalas_evento_min_user_func
    ON escalas (evento_id, ministerio_id, user_id, COALESCE(funcao, ''))
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_escalas_evento ON escalas(evento_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_escalas_user ON escalas(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_escalas_ministerio ON escalas(ministerio_id)`;
  console.log("escalas ok");

  // visitantes.user_id espelha o responsavel_id com FK pra users (novo)
  await sql`
    ALTER TABLE visitantes
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_visitantes_user_id ON visitantes(user_id)`;
  console.log("visitantes.user_id ok");

  console.log("=== Migration 006 finalizada ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
