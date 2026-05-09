import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!["admin", "supervisor"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const rows = await sql`
    SELECT ugr.user_id, ugr.results, ugr.created_at, u.nome, u.foto_url
    FROM user_gift_results ugr
    JOIN users u ON u.id = ugr.user_id
    ORDER BY ugr.created_at DESC
  `

  return NextResponse.json(rows)
}
