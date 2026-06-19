import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { sql } from "@/lib/neon"
import { verifyAppleIdentityToken } from "@/lib/apple-auth"
import { resolveMobileAuthUser, type MobileAuthProfile } from "@/lib/mobile-auth-user"

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
    console.error(
      "[/api/auth/mobile] Audience rejeitado:",
      payload.aud,
      "esperado um de:",
      validAudiences
    )
    throw new Error("Audience inválido")
  }

  return {
    googleId: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
    picture: payload.picture as string,
  }
}

function buildAppleName(fullName?: {
  givenName?: string | null
  familyName?: string | null
}) {
  if (!fullName) return null
  const parts = [fullName.givenName, fullName.familyName].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : null
}

async function profileFromBody(body: Record<string, unknown>): Promise<MobileAuthProfile> {
  const provider =
    body.provider === "apple" ? "apple" : body.provider === "google" ? "google" : null

  if (provider === "apple" || body.identityToken) {
    const identityToken = body.identityToken as string | undefined
    if (!identityToken) {
      throw new Error("identityToken obrigatório")
    }
    const apple = await verifyAppleIdentityToken(identityToken)
    const clientEmail =
      typeof body.email === "string" && body.email.trim() ? body.email.trim() : null
    const fullName = body.fullName as
      | { givenName?: string | null; familyName?: string | null }
      | undefined

    return {
      provider: "apple",
      providerAccountId: apple.appleId,
      email: apple.email ?? clientEmail,
      name: buildAppleName(fullName),
      picture: null,
    }
  }

  const idToken = body.idToken as string | undefined
  if (!idToken) {
    throw new Error("idToken obrigatório")
  }

  const google = await verifyGoogleIdToken(idToken)
  return {
    provider: "google",
    providerAccountId: google.googleId,
    email: google.email,
    name: google.name,
    picture: google.picture,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const profile = await profileFromBody(body)
    const resolved = await resolveMobileAuthUser(profile)

    if (resolved.blocked) {
      return NextResponse.json({ error: "Conta bloqueada" }, { status: 403 })
    }

    const ministerioRows = await sql`
      SELECT ministerio_id FROM ministerio_membros WHERE user_id = ${resolved.userId}
    `
    const ministerioIds = ministerioRows.map((r: any) => r.ministerio_id)

    const userRow = await sql`
      SELECT id, nome, email, foto_url, role FROM users WHERE id = ${resolved.userId}
    `

    const row = userRow[0]
    if (!row) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = {
      id: row.id,
      name: row.nome,
      email: row.email,
      image: row.foto_url,
      role: row.role,
      ministerioIds,
    }

    const token = await new SignJWT({
      userId: resolved.userId,
      role: user.role,
      ministerioIds,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .setSubject(resolved.userId)
      .sign(secret)

    return NextResponse.json({ token, user })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno"
    console.error("[/api/auth/mobile]", err)
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
