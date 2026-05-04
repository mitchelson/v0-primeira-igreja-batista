import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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
  const session = await auth()
  if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

  const body = await request.json()
  const { id, role, ativo, permite_escala_multipla, telefone, nome } = body
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  const rows = await sql`
    UPDATE users SET
      nome = COALESCE(${nome ?? null}, nome),
      role = COALESCE(${role ?? null}, role),
      ativo = COALESCE(${ativo ?? null}, ativo),
      permite_escala_multipla = COALESCE(${permite_escala_multipla ?? null}, permite_escala_multipla),
      telefone = COALESCE(${telefone ?? null}, telefone)
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  if (id === session.user.id) return NextResponse.json({ error: "Você não pode deletar a si mesmo" }, { status: 400 })

  await sql`DELETE FROM users WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
