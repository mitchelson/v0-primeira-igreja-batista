import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  const rows = await sql`
    SELECT u.*, 
      COALESCE(json_agg(json_build_object('ministerio_id', mm.ministerio_id, 'nome', m.nome, 'is_lider', mm.is_lider)) 
        FILTER (WHERE mm.id IS NOT NULL), '[]') as ministerios
    FROM users u
    LEFT JOIN ministerio_membros mm ON mm.user_id = u.id
    LEFT JOIN ministerios m ON m.id = mm.ministerio_id
    GROUP BY u.id
    ORDER BY u.nome ASC
  `
  return NextResponse.json(rows)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, role, ativo, permite_escala_multipla, telefone } = body
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  const rows = await sql`
    UPDATE users SET
      role = COALESCE(${role}, role),
      ativo = COALESCE(${ativo}, ativo),
      permite_escala_multipla = COALESCE(${permite_escala_multipla}, permite_escala_multipla),
      telefone = COALESCE(${telefone}, telefone)
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}
