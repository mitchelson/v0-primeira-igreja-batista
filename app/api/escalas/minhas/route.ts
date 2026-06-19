/**
 * GET /api/escalas/minhas
 * Retorna todos os eventos futuros, indicando se o usuário está escalado (web + mobile).
 */
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/mobile-auth"
import { sql } from "@/lib/neon"

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const userId = session.userId

  const eventos = await sql`
    SELECT e.id, e.titulo, e.data, e.horario, e.observacoes,
           CASE WHEN es.user_id IS NOT NULL THEN true ELSE false END as is_escalado,
           es.id as escala_id, es.funcao as minha_funcao, es.status as meu_status,
           es.observacao as minha_observacao, es.ministerio_id as ministerio_id,
           m.nome as ministerio, m.icone, m.cor,
           (SELECT count(*)::int FROM escalas WHERE evento_id = e.id) as total_escalados
    FROM eventos e
    LEFT JOIN escalas es ON es.evento_id = e.id AND es.user_id = ${userId}
    LEFT JOIN ministerios m ON m.id = es.ministerio_id
    WHERE e.data >= CURRENT_DATE
    ORDER BY e.data ASC
    LIMIT 20
  `

  return NextResponse.json(eventos)
}
