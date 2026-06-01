import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const rows = await sql`SELECT id, nome, email, foto_url, bio, nascimento, data_batismo, telefone FROM users WHERE id = ${session.user.id}`
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { nome, bio, nascimento, data_batismo, foto_url } = await request.json()

  const rows = await sql`
    UPDATE users SET
      nome = COALESCE(${nome?.trim() || null}, nome),
      bio = COALESCE(${bio ?? null}, bio),
      nascimento = COALESCE(${nascimento || null}, nascimento),
      data_batismo = COALESCE(${data_batismo || null}, data_batismo),
      foto_url = COALESCE(${foto_url || null}, foto_url)
    WHERE id = ${session.user.id}
    RETURNING id, nome, email, foto_url, bio, nascimento, data_batismo
  `
  return NextResponse.json(rows[0])
}
