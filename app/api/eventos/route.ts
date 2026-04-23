import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  const rows = await sql`SELECT * FROM eventos ORDER BY data DESC`
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const { titulo, data, horario, descricao, tipo } = await request.json()
  if (!titulo || !data) return NextResponse.json({ error: "titulo e data obrigatórios" }, { status: 400 })

  const rows = await sql`
    INSERT INTO eventos (titulo, data, horario, descricao, tipo)
    VALUES (${titulo}, ${data}, ${horario ?? null}, ${descricao ?? null}, ${tipo ?? "Culto"})
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}
