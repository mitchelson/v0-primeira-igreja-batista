import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { auth } from "@/lib/auth"
import { calculateResults } from "@/lib/dons-espirituais"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await sql`SELECT results FROM user_gift_results WHERE user_id = ${session.user.id}`
  return NextResponse.json({ results: rows[0]?.results ?? null })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { answers } = await request.json()
  if (!Array.isArray(answers) || answers.length !== 76) {
    return NextResponse.json({ error: "76 answers required" }, { status: 400 })
  }

  const results = calculateResults(answers)

  await sql`
    INSERT INTO user_gift_results (user_id, results, created_at)
    VALUES (${session.user.id}, ${JSON.stringify(results)}, now())
    ON CONFLICT (user_id) DO UPDATE SET results = ${JSON.stringify(results)}, created_at = now()
  `

  return NextResponse.json({ results })
}
