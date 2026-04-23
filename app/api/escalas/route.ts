import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { sendPushToUser } from "@/lib/push"

export async function GET(request: NextRequest) {
  const eventoId = request.nextUrl.searchParams.get("evento_id")

  if (eventoId) {
    const rows = await sql`
      SELECT e.*, u.nome as user_nome, u.foto_url, m.nome as ministerio_nome
      FROM escalas e
      JOIN users u ON u.id = e.user_id
      JOIN ministerios m ON m.id = e.ministerio_id
      WHERE e.evento_id = ${eventoId}
      ORDER BY m.nome, u.nome
    `
    return NextResponse.json(rows)
  }

  const rows = await sql`
    SELECT e.*, u.nome as user_nome, ev.titulo as evento_titulo, ev.data as evento_data, m.nome as ministerio_nome
    FROM escalas e
    JOIN users u ON u.id = e.user_id
    JOIN eventos ev ON ev.id = e.evento_id
    JOIN ministerios m ON m.id = e.ministerio_id
    ORDER BY ev.data DESC, m.nome
  `
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const { evento_id, ministerio_id, user_id, funcao } = await request.json()
  if (!evento_id || !ministerio_id || !user_id) {
    return NextResponse.json({ error: "evento_id, ministerio_id e user_id obrigatórios" }, { status: 400 })
  }

  // 1. Busca data do evento
  const evento = await sql`SELECT data FROM eventos WHERE id = ${evento_id}`
  if (evento.length === 0) return NextResponse.json({ error: "evento não encontrado" }, { status: 404 })

  // 2. Verifica conflito: user já escalado em outro ministério na mesma data
  const conflitos = await sql`
    SELECT e.id, m.nome as ministerio_nome, e.funcao
    FROM escalas e
    JOIN eventos ev ON ev.id = e.evento_id
    JOIN ministerios m ON m.id = e.ministerio_id
    WHERE e.user_id = ${user_id}
      AND ev.data = ${evento[0].data}
      AND e.ministerio_id != ${ministerio_id}
  `

  // 3. Busca flag do user
  const user = await sql`SELECT permite_escala_multipla FROM users WHERE id = ${user_id}`
  if (user.length === 0) return NextResponse.json({ error: "usuário não encontrado" }, { status: 404 })

  if (conflitos.length > 0 && !user[0].permite_escala_multipla) {
    return NextResponse.json({
      error: "Conflito de escala",
      conflitos: conflitos.map((c: any) => ({ ministerio: c.ministerio_nome, funcao: c.funcao })),
      message: `Usuário já escalado em: ${conflitos.map((c: any) => c.ministerio_nome).join(", ")}. Ative 'permite escala múltipla' no perfil para continuar.`,
    }, { status: 409 })
  }

  // 4. Insere
  const rows = await sql`
    INSERT INTO escalas (evento_id, ministerio_id, user_id, funcao)
    VALUES (${evento_id}, ${ministerio_id}, ${user_id}, ${funcao ?? null})
    ON CONFLICT (evento_id, user_id, ministerio_id) DO NOTHING
    RETURNING *
  `

  const warning = conflitos.length > 0
    ? `Atenção: usuário também escalado em ${conflitos.map((c: any) => c.ministerio_nome).join(", ")}`
    : undefined

  // Envia push notification ao membro escalado
  if (rows.length > 0) {
    const min = await sql`SELECT nome FROM ministerios WHERE id = ${ministerio_id}`
    const ev = await sql`SELECT titulo, data FROM eventos WHERE id = ${evento_id}`
    const dataFormatada = new Date(ev[0].data).toLocaleDateString("pt-BR")
    sendPushToUser(user_id, {
      title: "📋 Você foi escalado!",
      body: `${min[0]?.nome} — ${ev[0]?.titulo} (${dataFormatada})`,
      url: "/minha-area",
    }).catch((err) => console.error("Push error:", err))
  }

  return NextResponse.json({ ...rows[0], warning }, { status: 201 })
}
