import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const userId = session.user.id

  // Busca responsavel_id vinculado a este user
  const colCheck = await sql`
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'responsaveis' AND column_name = 'user_id' LIMIT 1
  `
  if (colCheck.length === 0) return NextResponse.json([])

  const resp = await sql`SELECT id FROM responsaveis WHERE user_id = ${userId}`
  if (resp.length === 0) return NextResponse.json([])

  const responsavelId = resp[0].id

  // Total de categorias ativas
  const cats = await sql`SELECT count(*)::int as total FROM mensagem_categorias WHERE ativa = true`
  const totalCategorias = cats[0].total
  if (totalCategorias === 0) return NextResponse.json([])

  // Visitantes deste responsável que NÃO têm sem_whatsapp e têm mensagens pendentes
  const pendencias = await sql`
    SELECT v.id, v.nome, v.celular, v.data_cadastro,
      count(vme.id)::int as enviadas
    FROM visitantes v
    LEFT JOIN visitante_mensagens_enviadas vme ON vme.visitante_id = v.id
    WHERE v.responsavel_id = ${responsavelId}
      AND v.sem_whatsapp = false
    GROUP BY v.id
    HAVING count(vme.id) < ${totalCategorias}
    ORDER BY v.data_cadastro DESC
  `

  return NextResponse.json(pendencias.map((p: any) => ({
    ...p,
    total_categorias: totalCategorias,
    pendentes: totalCategorias - p.enviadas,
  })))
}
