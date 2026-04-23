import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { sql } from "@/lib/neon"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false
      const { email, name, image } = user
      if (!email) return false

      // Verifica se já existe user com esse google_id
      const existing = await sql`
        SELECT id, role, ativo FROM users WHERE google_id = ${account.providerAccountId} LIMIT 1
      `

      if (existing.length > 0) {
        if (!existing[0].ativo) return false // bloqueado
        // Atualiza último login
        await sql`UPDATE users SET ultimo_login_em = now(), foto_url = ${image}, nome = ${name} WHERE id = ${existing[0].id}`
        return true
      }

      // Verifica se existe user pendente (migrado de responsáveis) com mesmo email ou nome
      const pendente = await sql`
        SELECT id FROM users WHERE google_id IS NULL AND (email = ${email} OR nome = ${name}) LIMIT 1
      `

      if (pendente.length > 0) {
        // Vincula conta Google ao user existente
        await sql`
          UPDATE users SET google_id = ${account.providerAccountId}, email = ${email}, nome = ${name}, foto_url = ${image}, ultimo_login_em = now()
          WHERE id = ${pendente[0].id}
        `
        return true
      }

      // Novo user — verifica se é o primeiro (vira admin)
      const count = await sql`SELECT count(*)::int as total FROM users`
      const role = count[0].total === 0 ? "admin" : "membro"

      await sql`
        INSERT INTO users (google_id, email, nome, foto_url, role)
        VALUES (${account.providerAccountId}, ${email}, ${name}, ${image}, ${role})
      `
      return true
    },

    async jwt({ token, account }) {
      if (account) {
        // Busca dados do user no banco
        const rows = await sql`
          SELECT id, role, ativo FROM users WHERE google_id = ${account.providerAccountId} LIMIT 1
        `
        if (rows.length > 0) {
          token.userId = rows[0].id
          token.role = rows[0].role
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})
