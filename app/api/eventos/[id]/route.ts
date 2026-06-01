import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { requireAdmin } from "@/lib/authorization"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdmin()
  if (!check.authorized) return check.response

  const { id } = await params
  const { titulo, data, horario, descricao, tipo, observacoes, repertorio_ministerio_id, repertorio_funcao } = await req.json()
  const rows = await sql`
    UPDATE eventos SET
      titulo = COALESCE(${titulo}, titulo),
      data = COALESCE(${data}, data),
      horario = COALESCE(${horario}, horario),
      descricao = COALESCE(${descricao}, descricao),
      tipo = COALESCE(${tipo}, tipo),
      observacoes = COALESCE(${observacoes}, observacoes),
      repertorio_ministerio_id = ${repertorio_ministerio_id ?? null},
      repertorio_funcao = ${repertorio_funcao ?? null}
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const check = await requireAdmin()
  if (!check.authorized) return check.response

  const { id } = await params
  await sql`DELETE FROM eventos WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
