import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`
      SELECT visitante_id, array_agg(DISTINCT categoria_id) as categoria_ids
      FROM visitante_mensagens_enviadas
      GROUP BY visitante_id
    `

    // Convert to Record<visitanteId, categoria_ids[]>
    const mapa: Record<string, string[]> = {}
    for (const row of result.rows) {
      mapa[row.visitante_id] = row.categoria_ids || []
    }

    return NextResponse.json(mapa)
  } catch (error) {
    console.error("Erro ao buscar status de mensagens:", error)
    return NextResponse.json(
      {
        error: "Erro ao buscar status de mensagens",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
