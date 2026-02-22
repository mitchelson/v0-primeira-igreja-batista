import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM responsaveis ORDER BY nome ASC
    `
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
