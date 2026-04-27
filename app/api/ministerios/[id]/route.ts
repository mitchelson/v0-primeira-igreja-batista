import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await sql`
    SELECT m.*,
      COALESCE(json_agg(json_build_object('user_id', u.id, 'nome', u.nome, 'email', u.email, 'foto_url', u.foto_url, 'is_lider', mm.is_lider, 'role', u.role))
        FILTER (WHERE u.id IS NOT NULL), '[]') as membros
    FROM ministerios m
    LEFT JOIN ministerio_membros mm ON mm.ministerio_id = m.id
    LEFT JOIN users u ON u.id = mm.user_id
    WHERE m.id = ${id}
    GROUP BY m.id
  `
  if (rows.length === 0) return NextResponse.json({ error: "não encontrado" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { nome, descricao, cor, icone, ativo, ordem } = await req.json()
  const rows = await sql`
    UPDATE ministerios SET
      nome = COALESCE(${nome}, nome),
      descricao = COALESCE(${descricao}, descricao),
      cor = COALESCE(${cor}, cor),
      icone = COALESCE(${icone}, icone),
      ativo = COALESCE(${ativo}, ativo),
      ordem = COALESCE(${ordem}, ordem)
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await sql`DELETE FROM ministerios WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
