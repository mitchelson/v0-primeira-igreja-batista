import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"
import { NextResponse } from "next/server"

type AuthResult =
  | { authorized: true; session: any }
  | { authorized: false; response: NextResponse }

/** Verifica se o usuário é admin */
export async function requireAdmin(): Promise<AuthResult> {
  const session = await auth()
  if (!session) return { authorized: false, response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) }
  if (session.user.role !== "admin") return { authorized: false, response: NextResponse.json({ error: "Sem permissão" }, { status: 403 }) }
  return { authorized: true, session }
}

/** Verifica se o usuário é admin OU líder/supervisor daquele ministério */
export async function requireMinisterioAccess(ministerioId: string): Promise<AuthResult> {
  const session = await auth()
  if (!session) return { authorized: false, response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) }
  if (session.user.role === "admin") return { authorized: true, session }

  if (session.user.role === "lider" || session.user.role === "supervisor") {
    const rows = await sql`
      SELECT 1 FROM ministerio_membros
      WHERE user_id = ${session.user.id} AND ministerio_id = ${ministerioId}
        AND (is_lider = true OR ${session.user.role} = 'supervisor')
    `
    if (rows.length > 0) return { authorized: true, session }
  }

  return { authorized: false, response: NextResponse.json({ error: "Sem permissão" }, { status: 403 }) }
}
