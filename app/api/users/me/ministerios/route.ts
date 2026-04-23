import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/neon"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const rows = await sql`
    SELECT ministerio_id FROM ministerio_membros WHERE user_id = ${session.user.id}
  `
  return NextResponse.json(rows.map((r: any) => r.ministerio_id))
}
