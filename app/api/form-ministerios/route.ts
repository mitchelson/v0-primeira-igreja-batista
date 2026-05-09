import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await sql`
    CREATE TABLE IF NOT EXISTS ministerio_form_respostas (
      user_id TEXT PRIMARY KEY,
      ministerios JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `
  const rows = await sql`SELECT ministerios FROM ministerio_form_respostas WHERE user_id = ${session.user.id}`
  const raw = rows[0]?.ministerios ?? null
  const ministerios = typeof raw === "string" ? JSON.parse(raw) : raw
  return NextResponse.json({ ministerios })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { ministerios } = await request.json()
  if (!Array.isArray(ministerios) || ministerios.length === 0) {
    return NextResponse.json({ error: "Selecione ao menos um ministério" }, { status: 400 })
  }

  await sql`
    CREATE TABLE IF NOT EXISTS ministerio_form_respostas (
      user_id TEXT PRIMARY KEY,
      ministerios JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `

  await sql`
    INSERT INTO ministerio_form_respostas (user_id, ministerios, updated_at)
    VALUES (${session.user.id}, ${JSON.stringify(ministerios)}, now())
    ON CONFLICT (user_id) DO UPDATE SET ministerios = ${JSON.stringify(ministerios)}, updated_at = now()
  `

  return NextResponse.json({ ok: true })
}
