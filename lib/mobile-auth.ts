import { jwtVerify } from "jose"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

const secret = new TextEncoder().encode(
  process.env.AUTH_MOBILE_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "fallback-secret"
)

export interface MobileSession {
  userId: string
  role: string
  ministerioIds: string[]
}

/**
 * Extrai sessão tanto de NextAuth (cookie) quanto de Bearer JWT (mobile)
 */
export async function getSession(request: NextRequest): Promise<MobileSession | null> {
  // 1. Tenta Bearer token (app mobile)
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    try {
      const { payload } = await jwtVerify(token, secret)
      const userId = payload.userId as string
      const role = payload.role as string
      const ministerioIds = (payload.ministerioIds as string[]) ?? []

      // Verifica se o user ainda está ativo
      const rows = await sql`SELECT ativo FROM users WHERE id = ${userId} LIMIT 1`
      if (!rows[0]?.ativo) return null

      return { userId, role, ministerioIds }
    } catch {
      return null
    }
  }

  // 2. Fallback: sessão NextAuth (web)
  const session = await auth()
  if (!session?.user?.id) return null

  return {
    userId: session.user.id,
    role: session.user.role,
    ministerioIds: (session.user as any).ministerioIds ?? [],
  }
}

/** Verifica se é admin via Bearer ou NextAuth */
export async function requireAdminUniversal(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return { authorized: false as const, error: "Não autenticado", status: 401 }
  if (session.role !== "admin") return { authorized: false as const, error: "Sem permissão", status: 403 }
  return { authorized: true as const, session }
}

/** Verifica acesso ao ministério via Bearer ou NextAuth */
export async function requireMinisterioAccessUniversal(ministerioId: string, request: NextRequest) {
  const session = await getSession(request)
  if (!session) return { authorized: false as const, error: "Não autenticado", status: 401 }
  if (session.role === "admin") return { authorized: true as const, session }

  if (session.role === "lider" || session.role === "supervisor") {
    const rows = await sql`
      SELECT 1 FROM ministerio_membros
      WHERE user_id = ${session.userId} AND ministerio_id = ${ministerioId}
        AND (is_lider = true OR ${session.role} = 'supervisor')
    `
    if (rows.length > 0) return { authorized: true as const, session }
  }

  return { authorized: false as const, error: "Sem permissão", status: 403 }
}
