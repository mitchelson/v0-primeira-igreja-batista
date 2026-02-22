import { sql } from "@/lib/neon"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    const sets: string[] = []
    const vals: unknown[] = []

    if (body.nome !== undefined) {
      sets.push("nome")
      vals.push(body.nome)
    }
    if (body.descricao !== undefined) {
      sets.push("descricao")
      vals.push(body.descricao)
    }
    if (body.ordem !== undefined) {
      sets.push("ordem")
      vals.push(body.ordem)
    }
    if (body.ativa !== undefined) {
      sets.push("ativa")
      vals.push(body.ativa)
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    // Build dynamic update using tagged template
    let result
    if (sets.length === 1 && sets[0] === "ativa") {
      result = await sql`UPDATE mensagem_categorias SET ativa = ${body.ativa}, updated_at = NOW() WHERE id = ${id} RETURNING *`
    } else if (sets.length === 1 && sets[0] === "nome") {
      result = await sql`UPDATE mensagem_categorias SET nome = ${body.nome}, updated_at = NOW() WHERE id = ${id} RETURNING *`
    } else if (sets.length === 1 && sets[0] === "descricao") {
      result = await sql`UPDATE mensagem_categorias SET descricao = ${body.descricao}, updated_at = NOW() WHERE id = ${id} RETURNING *`
    } else {
      result = await sql`
        UPDATE mensagem_categorias
        SET nome = COALESCE(${body.nome ?? null}, nome),
            descricao = COALESCE(${body.descricao ?? null}, descricao),
            ordem = COALESCE(${body.ordem ?? null}, ordem),
            ativa = COALESCE(${body.ativa ?? null}, ativa),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await sql`DELETE FROM mensagem_modelos WHERE categoria_id = ${id}`
    await sql`DELETE FROM visitante_mensagens_enviadas WHERE categoria_id = ${id}`
    const result = await sql`DELETE FROM mensagem_categorias WHERE id = ${id} RETURNING id`
    if (result.length === 0) {
      return NextResponse.json({ error: "Categoria nao encontrada" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar categoria:", error)
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 })
  }
}
