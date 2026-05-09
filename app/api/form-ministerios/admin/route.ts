import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!["admin", "supervisor"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await sql`
    CREATE TABLE IF NOT EXISTS ministerio_form_respostas (
      user_id TEXT PRIMARY KEY,
      ministerios JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `

  const rows = await sql`
    SELECT mfr.user_id, mfr.ministerios, mfr.updated_at, u.nome, u.foto_url
    FROM ministerio_form_respostas mfr
    JOIN users u ON u.id = mfr.user_id
    ORDER BY mfr.updated_at DESC
  `

  return NextResponse.json(rows)
}
