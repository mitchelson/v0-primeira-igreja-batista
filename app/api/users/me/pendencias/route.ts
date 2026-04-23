import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const userId = session.user.id

  // Total de categorias ativas
  const cats = await sql`SELECT count(*)::int as total FROM mensagem_categorias WHERE ativa = true`
  const totalCategorias = cats[0].total
  if (totalCategorias === 0) return NextResponse.json([])

  // Visitantes deste responsável com mensagens pendentes
  const pendencias = await sql`
    SELECT v.id, v.nome, v.celular, v.data_cadastro,
      count(vme.id)::int as enviadas
    FROM visitantes v
    LEFT JOIN visitante_mensagens_enviadas vme ON vme.visitante_id = v.id
    WHERE v.user_id = ${userId}
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
