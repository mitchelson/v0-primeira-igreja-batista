import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  const rows = await sql`
    SELECT m.*,
      (SELECT count(*)::int FROM ministerio_membros mm WHERE mm.ministerio_id = m.id) as total_membros
    FROM ministerios m ORDER BY m.ordem ASC, m.nome ASC
  `
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const { nome, descricao, cor, icone, ordem } = await request.json()
  if (!nome) return NextResponse.json({ error: "nome obrigatório" }, { status: 400 })

  const rows = await sql`
    INSERT INTO ministerios (nome, descricao, cor, icone, ordem)
    VALUES (${nome}, ${descricao ?? null}, ${cor ?? "#D4C5B0"}, ${icone ?? "⛪"}, ${ordem ?? 0})
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}
