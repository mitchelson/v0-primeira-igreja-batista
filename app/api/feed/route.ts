import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const limit = 20
  const offset = (page - 1) * limit

  // Busca o user_id do viewer para saber se curtiu
  const session = await auth()
  const userId = session?.user?.id || null

  const posts = await sql`
    SELECT p.*, u.nome as autor_nome, u.foto_url as autor_foto,
      (SELECT count(*)::int FROM feed_likes WHERE post_id = p.id) as likes_count,
      (SELECT count(*)::int FROM feed_comments WHERE post_id = p.id) as comments_count,
      ${userId ? sql`(SELECT count(*)::int > 0 FROM feed_likes WHERE post_id = p.id AND user_id = ${userId})` : sql`false`} as liked
    FROM feed_posts p
    JOIN users u ON u.id = p.autor_id
    WHERE p.ativo = true
    ORDER BY p.fixado DESC, p.criado_em DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  const total = await sql`SELECT count(*)::int as total FROM feed_posts WHERE ativo = true`

  return NextResponse.json({ posts, total: total[0].total, page, pages: Math.ceil(total[0].total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  // Verifica permissão: admin ou membro do ministério configurado
  const userId = session.user.id
  if (session.user.role !== "admin") {
    const config = await sql`SELECT valor FROM app_config WHERE chave = 'feed_ministerio_id'`
    const feedMinId = config[0]?.valor
    if (!feedMinId) return NextResponse.json({ error: "Feed não configurado" }, { status: 403 })

    const membership = await sql`
      SELECT 1 FROM ministerio_membros WHERE user_id = ${userId} AND ministerio_id = ${feedMinId}
    `
    if (membership.length === 0) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  const { conteudo, imagem_url } = await request.json()
  if (!conteudo && !imagem_url) return NextResponse.json({ error: "Conteúdo ou imagem obrigatório" }, { status: 400 })

  const rows = await sql`
    INSERT INTO feed_posts (autor_id, conteudo, imagem_url)
    VALUES (${userId}, ${conteudo || null}, ${imagem_url || null})
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}
