import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  try {
    // Verifica se a coluna user_id existe (migração 010)
    const colCheck = await sql`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'responsaveis' AND column_name = 'user_id' LIMIT 1
    `

    const rows = colCheck.length > 0
      ? await sql`
          SELECT r.*, u.nome as user_nome, u.foto_url
          FROM responsaveis r
          LEFT JOIN users u ON u.id = r.user_id
          WHERE r.user_id IS NULL
             OR r.user_id IN (
               SELECT mm.user_id FROM ministerio_membros mm
               JOIN ministerios m ON m.id = mm.ministerio_id
               WHERE m.nome = 'Integração & Comunhão'
             )
          ORDER BY r.nome ASC
        `
      : await sql`SELECT * FROM responsaveis ORDER BY nome ASC`

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Erro ao buscar responsáveis:", error)
    return NextResponse.json(
      { error: "Erro ao buscar responsáveis" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome } = body

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const rows = await sql`
      INSERT INTO responsaveis (nome) VALUES (${nome})
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar responsável:", error)
    return NextResponse.json(
      { error: "Erro ao criar responsável" },
      { status: 500 }
    )
  }
}
