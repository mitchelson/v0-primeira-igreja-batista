import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { requireMinisterioAccess } from "@/lib/authorization"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Busca o ministério da escala para verificar permissão
  const escala = await sql`SELECT ministerio_id FROM escalas WHERE id = ${id}`
  if (escala.length === 0) return NextResponse.json({ error: "não encontrado" }, { status: 404 })

  const check = await requireMinisterioAccess(escala[0].ministerio_id)
  if (!check.authorized) return check.response

  const { status, funcao } = await req.json()
  const rows = await sql`
    UPDATE escalas SET
      status = COALESCE(${status}, status),
      funcao = COALESCE(${funcao}, funcao)
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const escala = await sql`SELECT ministerio_id FROM escalas WHERE id = ${id}`
  if (escala.length === 0) return NextResponse.json({ error: "não encontrado" }, { status: 404 })

  const check = await requireMinisterioAccess(escala[0].ministerio_id)
  if (!check.authorized) return check.response

  await sql`DELETE FROM escalas WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
