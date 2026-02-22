import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await sql`
      SELECT
        v.*,
        r.nome AS responsavel_nome
      FROM visitantes v
      LEFT JOIN responsaveis r ON v.responsavel_id = r.id
      WHERE v.id = ${id}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Visitante nao encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Erro ao buscar visitante:", error)
    return NextResponse.json(
      { error: "Erro ao buscar visitante" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      nome,
      celular,
      sexo,
      cidade,
      cidade_outra,
      bairro,
      faixa_etaria,
      civil_status,
      membro_igreja,
      quer_visita,
      msg_segunda,
      msg_sabado,
      sem_whatsapp,
      responsavel_id,
    } = body

    const rows = await sql`
      UPDATE visitantes SET
        nome = COALESCE(${nome ?? null}, nome),
        celular = COALESCE(${celular ?? null}, celular),
        sexo = ${sexo ?? null},
        cidade = ${cidade ?? null},
        cidade_outra = ${cidade_outra ?? null},
        bairro = ${bairro ?? null},
        faixa_etaria = ${faixa_etaria ?? null},
        civil_status = ${civil_status ?? null},
        membro_igreja = COALESCE(${membro_igreja ?? null}, membro_igreja),
        quer_visita = COALESCE(${quer_visita ?? null}, quer_visita),
        msg_segunda = COALESCE(${msg_segunda ?? null}, msg_segunda),
        msg_sabado = COALESCE(${msg_sabado ?? null}, msg_sabado),
        sem_whatsapp = COALESCE(${sem_whatsapp ?? null}, sem_whatsapp),
        responsavel_id = ${responsavel_id ?? null}
      WHERE id = ${id}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Visitante nao encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Erro ao atualizar visitante:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar visitante" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await sql`
      DELETE FROM visitantes WHERE id = ${id} RETURNING id
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Visitante nao encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar visitante:", error)
    return NextResponse.json(
      { error: "Erro ao deletar visitante" },
      { status: 500 }
    )
  }
}
