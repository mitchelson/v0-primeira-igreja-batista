import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function POST(request: NextRequest) {
  const { user_id, ministerio_id, is_lider } = await request.json()
  const rows = await sql`
    INSERT INTO ministerio_membros (user_id, ministerio_id, is_lider)
    VALUES (${user_id}, ${ministerio_id}, ${is_lider ?? false})
    ON CONFLICT (ministerio_id, user_id) DO UPDATE SET is_lider = ${is_lider ?? false}
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { user_id, ministerio_id } = await request.json()
  await sql`DELETE FROM ministerio_membros WHERE user_id = ${user_id} AND ministerio_id = ${ministerio_id}`
  return NextResponse.json({ ok: true })
}
