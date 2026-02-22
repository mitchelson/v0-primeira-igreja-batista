import { sql } from "@/lib/neon"
import { NextResponse } from "next/server"

// GET /api/mensagens/enviadas?visitante_id=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const visitanteId = searchParams.get("visitante_id")

    if (!visitanteId) {
      return NextResponse.json(
        { error: "visitante_id obrigatorio" },
        { status: 400 },
      )
    }

    const enviadas = await sql`
      SELECT * FROM visitante_mensagens_enviadas
      WHERE visitante_id = ${visitanteId}
      ORDER BY enviada_em DESC
    `
    return NextResponse.json(enviadas)
  } catch (error) {
    console.error("Erro ao buscar mensagens enviadas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar mensagens enviadas" },
      { status: 500 },
    )
  }
}

// POST /api/mensagens/enviadas  { visitante_id, categoria_id }
export async function POST(request: Request) {
  try {
    const { visitante_id, categoria_id } = await request.json()
    if (!visitante_id || !categoria_id) {
      return NextResponse.json(
        { error: "visitante_id e categoria_id obrigatorios" },
        { status: 400 },
      )
    }

    // Upsert - if already exists, update the timestamp
    const result = await sql`
      INSERT INTO visitante_mensagens_enviadas (visitante_id, categoria_id)
      VALUES (${visitante_id}, ${categoria_id})
      ON CONFLICT (visitante_id, categoria_id)
      DO UPDATE SET enviada_em = NOW()
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar mensagem enviada:", error)
    return NextResponse.json(
      { error: "Erro ao registrar mensagem enviada" },
      { status: 500 },
    )
  }
}
