import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { mode } = await req.json()
  const res = NextResponse.json({ ok: true })
  res.cookies.set("auth_mode", mode === "login" ? "login" : "signup", {
    path: "/",
    maxAge: 300,
    httpOnly: true,
    sameSite: "lax",
  })
  return res
}
