import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { titulo, data, horario, descricao, tipo } = await req.json()
  const rows = await sql`
    UPDATE eventos SET
      titulo = COALESCE(${titulo}, titulo),
      data = COALESCE(${data}, data),
      horario = COALESCE(${horario}, horario),
      descricao = COALESCE(${descricao}, descricao),
      tipo = COALESCE(${tipo}, tipo)
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await sql`DELETE FROM eventos WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
