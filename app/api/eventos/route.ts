import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  const rows = await sql`SELECT * FROM eventos ORDER BY data DESC`
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const { titulo, data, horario, descricao, tipo, modelo_id } = await request.json()
  if (!titulo || !data) return NextResponse.json({ error: "titulo e data obrigatórios" }, { status: 400 })

  const rows = await sql`
    INSERT INTO eventos (titulo, data, horario, descricao, tipo, modelo_id)
    VALUES (${titulo}, ${data}, ${horario ?? null}, ${descricao ?? null}, ${tipo ?? "Culto"}, ${modelo_id ?? null})
    RETURNING *
  `
  const evento = rows[0]

  // Copiar posições do modelo para o evento
  if (modelo_id) {
    await sql`
      INSERT INTO evento_posicoes (evento_id, ministerio_id, funcao, quantidade)
      SELECT ${evento.id}, ministerio_id, funcao, quantidade
      FROM evento_posicoes WHERE modelo_id = ${modelo_id}
    `
  }

  return NextResponse.json(evento, { status: 201 })
}
