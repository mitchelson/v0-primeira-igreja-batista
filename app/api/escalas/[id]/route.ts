import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
  await sql`DELETE FROM escalas WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
