import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { user_id, ministerio_id } = body
  const hasLider = "is_lider" in body
  const hasPendente = "pendente" in body

  const rows = hasLider
    ? await sql`
        INSERT INTO ministerio_membros (user_id, ministerio_id, is_lider)
        VALUES (${user_id}, ${ministerio_id}, ${body.is_lider})
        ON CONFLICT (ministerio_id, user_id) DO UPDATE SET is_lider = ${body.is_lider}
        RETURNING *
      `
    : hasPendente
    ? await sql`
        UPDATE ministerio_membros SET pendente = ${body.pendente}
        WHERE user_id = ${user_id} AND ministerio_id = ${ministerio_id}
        RETURNING *
      `
    : await sql`
        INSERT INTO ministerio_membros (user_id, ministerio_id)
        VALUES (${user_id}, ${ministerio_id})
        ON CONFLICT (ministerio_id, user_id) DO NOTHING
        RETURNING *
      `

  return NextResponse.json(rows[0] ?? { user_id, ministerio_id }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { user_id, ministerio_id } = await request.json()
  await sql`DELETE FROM ministerio_membros WHERE user_id = ${user_id} AND ministerio_id = ${ministerio_id}`
  return NextResponse.json({ ok: true })
}
