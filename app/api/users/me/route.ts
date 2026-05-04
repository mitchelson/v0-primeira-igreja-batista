import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { nome } = await request.json()
  if (!nome?.trim()) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 })

  const rows = await sql`
    UPDATE users SET nome = ${nome.trim()} WHERE id = ${session.user.id} RETURNING nome
  `
  return NextResponse.json(rows[0])
}
