import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categorias = await sql`
      SELECT c.*,
        COALESCE(
          json_agg(
            json_build_object('id', m.id, 'titulo', m.titulo, 'corpo', m.corpo, 'ordem', m.ordem)
            ORDER BY m.ordem
          ) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) as modelos
      FROM mensagem_categorias c
      LEFT JOIN mensagem_modelos m ON m.categoria_id = c.id
      GROUP BY c.id
      ORDER BY c.ordem
    `
    return NextResponse.json(categorias)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { nome, descricao, ordem } = await request.json()
    if (!nome) {
      return NextResponse.json({ error: "Nome obrigatorio" }, { status: 400 })
    }

    const maxOrdem = ordem ?? (await sql`SELECT COALESCE(MAX(ordem), 0) + 1 as next FROM mensagem_categorias`)[0].next

    const result = await sql`
      INSERT INTO mensagem_categorias (nome, descricao, ordem)
      VALUES (${nome}, ${descricao || null}, ${maxOrdem})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 },
    )
  }
}
