import { sql } from "@/lib/neon"

export type MobileProvider = "google" | "apple"

export interface MobileAuthProfile {
  provider: MobileProvider
  providerAccountId: string
  email?: string | null
  name?: string | null
  picture?: string | null
}

type ResolvedUser = {
  userId: string
  role: string
  blocked: boolean
}

async function findByProvider(profile: MobileAuthProfile) {
  if (profile.provider === "google") {
    return sql`
      SELECT id, role, ativo FROM users
      WHERE google_id = ${profile.providerAccountId}
      LIMIT 1
    `
  }
  return sql`
    SELECT id, role, ativo FROM users
    WHERE apple_id = ${profile.providerAccountId}
    LIMIT 1
  `
}

async function findByEmail(email: string) {
  return sql`
    SELECT id, role, ativo FROM users
    WHERE lower(trim(email)) = lower(trim(${email}))
    LIMIT 1
  `
}

async function findPending(profile: MobileAuthProfile) {
  if (profile.email) {
    const byEmail = await sql`
      SELECT id, role, ativo FROM users
      WHERE google_id IS NULL AND email = ${profile.email}
      LIMIT 1
    `
    if (byEmail.length > 0) return byEmail
  }

  if (profile.name) {
    const byName = await sql`
      SELECT id, role, ativo FROM users
      WHERE google_id IS NULL AND nome = ${profile.name}
      LIMIT 1
    `
    if (byName.length > 0) return byName
  }

  return []
}

async function linkProvider(userId: string, profile: MobileAuthProfile) {
  if (profile.provider === "google") {
    await sql`
      UPDATE users SET google_id = COALESCE(google_id, ${profile.providerAccountId})
      WHERE id = ${userId}
    `
  } else {
    await sql`
      UPDATE users SET apple_id = COALESCE(apple_id, ${profile.providerAccountId})
      WHERE id = ${userId}
    `
  }
}

async function updateProfileOnLogin(userId: string, profile: MobileAuthProfile) {
  await sql`UPDATE users SET ultimo_login_em = now() WHERE id = ${userId}`

  if (profile.name) {
    await sql`UPDATE users SET nome = ${profile.name} WHERE id = ${userId}`
  }
  if (profile.email) {
    await sql`UPDATE users SET email = ${profile.email} WHERE id = ${userId}`
  }
  if (profile.picture) {
    await sql`UPDATE users SET foto_url = ${profile.picture} WHERE id = ${userId}`
  }
}

async function createUser(profile: MobileAuthProfile, role: string) {
  if (profile.provider === "google") {
    const inserted = await sql`
      INSERT INTO users (google_id, email, nome, foto_url, role)
      VALUES (
        ${profile.providerAccountId},
        ${profile.email || null},
        ${profile.name || null},
        ${profile.picture || null},
        ${role}
      )
      RETURNING id
    `
    return inserted[0].id as string
  }

  const inserted = await sql`
    INSERT INTO users (apple_id, email, nome, foto_url, role)
    VALUES (
      ${profile.providerAccountId},
      ${profile.email || null},
      ${profile.name || null},
      ${profile.picture || null},
      ${role}
    )
    RETURNING id
  `
  return inserted[0].id as string
}

export async function resolveMobileAuthUser(
  profile: MobileAuthProfile
): Promise<ResolvedUser> {
  const existing = await findByProvider(profile)
  if (existing.length > 0) {
    const user = existing[0]
    if (!user.ativo) {
      return { userId: user.id, role: user.role, blocked: true }
    }
    await updateProfileOnLogin(user.id, profile)
    return { userId: user.id, role: user.role, blocked: false }
  }

  if (profile.email) {
    const byEmail = await findByEmail(profile.email)
    if (byEmail.length > 0) {
      const user = byEmail[0]
      if (!user.ativo) {
        return { userId: user.id, role: user.role, blocked: true }
      }
      await linkProvider(user.id, profile)
      await updateProfileOnLogin(user.id, profile)
      const updated = await sql`SELECT role FROM users WHERE id = ${user.id}`
      return { userId: user.id, role: updated[0].role, blocked: false }
    }
  }

  const pendente = await findPending(profile)
  if (pendente.length > 0) {
    const user = pendente[0]
    if (!user.ativo) {
      return { userId: user.id, role: user.role, blocked: true }
    }
    await linkProvider(user.id, profile)
    await updateProfileOnLogin(user.id, profile)
    const updated = await sql`SELECT role FROM users WHERE id = ${user.id}`
    return { userId: user.id, role: updated[0].role, blocked: false }
  }

  const count = await sql`SELECT count(*)::int as total FROM users`
  const role = count[0].total === 0 ? "admin" : "visitor"
  const userId = await createUser(profile, role)
  return { userId, role, blocked: false }
}
