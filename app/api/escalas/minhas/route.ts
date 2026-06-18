/**
 * GET /api/escalas/minhas
 * Retorna as próximas escalas do usuário autenticado (web + mobile).
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
           true as is_escalado,
           es.id as escala_id, es.funcao as minha_funcao, es.status as meu_status,
           es.observacao as minha_observacao, es.ministerio_id as ministerio_id,
           m.nome as ministerio, m.icone, m.cor
    FROM escalas es
    JOIN eventos e ON e.id = es.evento_id
    LEFT JOIN ministerios m ON m.id = es.ministerio_id
    WHERE es.user_id = ${userId}
      AND e.data >= CURRENT_DATE
    ORDER BY e.data ASC
    LIMIT 15
  `

  return NextResponse.json(eventos)
}
