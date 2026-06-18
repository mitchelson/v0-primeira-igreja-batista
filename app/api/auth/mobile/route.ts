import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { sql } from "@/lib/neon"

const secret = new TextEncoder().encode(
  process.env.AUTH_MOBILE_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "fallback-secret"
)

function getValidGoogleAudiences() {
  return [
    process.env.AUTH_GOOGLE_ID,
    process.env.GOOGLE_CLIENT_ID,
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  ].filter(Boolean)
}

async function verifyGoogleIdToken(idToken: string) {
  // Valida o id_token do Google via endpoint público
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  )
  if (!res.ok) throw new Error("Token inválido")
  const payload = await res.json()

  const validAudiences = getValidGoogleAudiences()

  if (validAudiences.length === 0) {
    throw new Error("Google Client ID não configurado no servidor")
  }

  if (!validAudiences.includes(payload.aud)) {
    console.error("[/api/auth/mobile] Audience rejeitado:", payload.aud, "esperado um de:", validAudiences)
    throw new Error("Audience inválido")
  }

  return {
    googleId: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
    picture: payload.picture as string,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: "idToken obrigatório" }, { status: 400 })
    }

    const google = await verifyGoogleIdToken(idToken)

    // Busca ou cria o usuário (mesma lógica do signIn callback do NextAuth)
    const existing = await sql`
      SELECT id, role, ativo, nome, foto_url, email FROM users
      WHERE google_id = ${google.googleId} LIMIT 1
    `

    let userId: string
    let role: string

    if (existing.length > 0) {
      if (!existing[0].ativo) {
        return NextResponse.json({ error: "Conta bloqueada" }, { status: 403 })
      }
      userId = existing[0].id
      role = existing[0].role

      // Atualiza last login + foto
      await sql`
        UPDATE users SET ultimo_login_em = now(), foto_url = ${google.picture}, nome = ${google.name}
        WHERE id = ${userId}
      `
    } else {
      // Verifica se existe usuário pendente (migrado) com mesmo email
      const pendente = await sql`
        SELECT id FROM users WHERE google_id IS NULL AND (email = ${google.email} OR nome = ${google.name}) LIMIT 1
      `

      if (pendente.length > 0) {
        await sql`
          UPDATE users SET google_id = ${google.googleId}, email = ${google.email},
            nome = ${google.name}, foto_url = ${google.picture}, ultimo_login_em = now()
          WHERE id = ${pendente[0].id}
        `
        const updated = await sql`SELECT id, role FROM users WHERE id = ${pendente[0].id}`
        userId = updated[0].id
        role = updated[0].role
      } else {
        // Novo usuário — primeiro vira admin, demais viram membro
        const count = await sql`SELECT count(*)::int as total FROM users`
        role = count[0].total === 0 ? "admin" : "membro"

        const inserted = await sql`
          INSERT INTO users (google_id, email, nome, foto_url, role)
          VALUES (${google.googleId}, ${google.email}, ${google.name}, ${google.picture}, ${role})
          RETURNING id
        `
        userId = inserted[0].id
      }
    }

    // Busca ministérios do usuário
    const ministerioRows = await sql`
      SELECT ministerio_id FROM ministerio_membros WHERE user_id = ${userId}
    `
    const ministerioIds = ministerioRows.map((r: any) => r.ministerio_id)

    // Busca dados completos do user
    const userRow = await sql`
      SELECT id, nome, email, foto_url, role FROM users WHERE id = ${userId}
    `

    const user = {
      id: userRow[0].id,
      name: userRow[0].nome,
      email: userRow[0].email,
      image: userRow[0].foto_url,
      role: userRow[0].role,
      ministerioIds,
    }

    // Gera JWT com expiração de 30 dias
    const token = await new SignJWT({ userId, role, ministerioIds })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .setSubject(userId)
      .sign(secret)

    return NextResponse.json({ token, user })
  } catch (err: any) {
    console.error("[/api/auth/mobile]", err)
    return NextResponse.json(
      { error: err.message ?? "Erro interno" },
      { status: 401 }
    )
  }
}
