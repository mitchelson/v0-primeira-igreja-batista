import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const rows = await sql`
    SELECT * FROM notifications
    WHERE user_id = ${session.user.id}
    ORDER BY criado_em DESC
    LIMIT 50
  `
  const unread = await sql`
    SELECT count(*)::int as total FROM notifications
    WHERE user_id = ${session.user.id} AND lida = false
  `
  return NextResponse.json({ notifications: rows, unread: unread[0].total })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id, all } = await request.json()

  if (all) {
    await sql`UPDATE notifications SET lida = true WHERE user_id = ${session.user.id} AND lida = false`
  } else if (id) {
    await sql`UPDATE notifications SET lida = true WHERE id = ${id} AND user_id = ${session.user.id}`
  }

  return NextResponse.json({ ok: true })
}
