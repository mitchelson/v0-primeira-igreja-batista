import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

async function canEdit(userId: string, eventoId: string): Promise<boolean> {
  // Check if admin
  const user = await sql`SELECT role FROM users WHERE id = ${userId}`
  if (user[0]?.role === "admin") return true

  // Check event permission config
  const evento = await sql`SELECT repertorio_ministerio_id, repertorio_funcao FROM eventos WHERE id = ${eventoId}`
  const { repertorio_ministerio_id, repertorio_funcao } = evento[0] || {}
  if (!repertorio_ministerio_id) return false

  // Check if user belongs to that ministry
  const membership = await sql`
    SELECT 1 FROM ministerio_membros WHERE user_id = ${userId} AND ministerio_id = ${repertorio_ministerio_id}
  `
  if (membership.length === 0) return false

  // If a specific funcao is required, check the user's escala funcao for this event
  if (repertorio_funcao) {
    const escala = await sql`
      SELECT 1 FROM escalas WHERE user_id = ${userId} AND evento_id = ${eventoId} AND funcao = ${repertorio_funcao}
    `
    if (escala.length === 0) return false
  }

  return true
}

export async function GET(request: NextRequest) {
  const eventoId = request.nextUrl.searchParams.get("evento_id")
  if (!eventoId) return NextResponse.json({ error: "evento_id required" }, { status: 400 })

  const items = await sql`
    SELECT * FROM repertorio_items WHERE evento_id = ${eventoId} ORDER BY ordem, criado_em
  `

  // Check permission for the caller
  const session = await auth()
  let canEditRepertoire = false
  if (session?.user?.id) {
    canEditRepertoire = await canEdit(session.user.id, eventoId)
  }

  return NextResponse.json({ items, canEdit: canEditRepertoire })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { evento_id, items } = await request.json()
  if (!evento_id || !items?.length) return NextResponse.json({ error: "evento_id and items required" }, { status: 400 })

  if (!(await canEdit(session.user.id, evento_id)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Delete existing and insert new
  await sql`DELETE FROM repertorio_items WHERE evento_id = ${evento_id}`
  for (let i = 0; i < items.length; i++) {
    const { nome, tonalidade, link, observacoes } = items[i]
    if (!nome?.trim()) continue
    await sql`
      INSERT INTO repertorio_items (evento_id, nome, tonalidade, link, observacoes, ordem)
      VALUES (${evento_id}, ${nome.trim()}, ${tonalidade || null}, ${link || null}, ${observacoes || null}, ${i})
    `
  }

  const result = await sql`SELECT * FROM repertorio_items WHERE evento_id = ${evento_id} ORDER BY ordem`
  return NextResponse.json(result, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { evento_id } = await request.json()
  if (!evento_id) return NextResponse.json({ error: "evento_id required" }, { status: 400 })

  if (!(await canEdit(session.user.id, evento_id)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await sql`DELETE FROM repertorio_items WHERE evento_id = ${evento_id}`
  return NextResponse.json({ ok: true })
}
