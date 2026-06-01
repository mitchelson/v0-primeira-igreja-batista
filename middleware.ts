import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// UUID pattern for ministry detail pages
const ministerioDetailRegex = /^\/admin\/ministerios\/([0-9a-f-]{36})$/

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Páginas públicas — sem proteção
  if (
    pathname === "/" ||
    pathname.startsWith("/cadastro") ||
    pathname.startsWith("/eventos") ||
    pathname.startsWith("/ministerios") ||
    pathname.startsWith("/sobre") ||
    pathname.startsWith("/contato") ||
    pathname.startsWith("/sermoes") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/api/feed") ||
    pathname.startsWith("/api/visitantes") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // Sem sessão → login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = session.user?.role

  // /admin/** → apenas admin, supervisor e lider
  if (pathname.startsWith("/admin")) {
    if (role !== "admin" && role !== "supervisor" && role !== "lider") {
      return NextResponse.redirect(new URL("/minha-area", req.url))
    }

    // Admin pode tudo
    if (role === "admin") return NextResponse.next()

    // Líderes e supervisores: só podem acessar /admin e /admin/ministerios/[id] dos seus ministérios
    const match = ministerioDetailRegex.exec(pathname)
    if (match) {
      const ministerioId = match[1]
      const ministerioIds: string[] = (session.user as any).ministerioIds || []
      if (!ministerioIds.includes(ministerioId)) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.next()
    }

    // Dashboard é permitido
    if (pathname === "/admin") return NextResponse.next()

    // Qualquer outra página admin é bloqueada para líder/supervisor
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/minha-area/:path*"],
}
