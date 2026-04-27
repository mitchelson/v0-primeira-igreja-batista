import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const adminOnlyPaths = ["/admin/membros", "/admin/eventos"]

// UUID pattern for ministry detail pages
const ministerioDetailRegex = /^\/admin\/ministerios\/[0-9a-f-]{36}$/

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

    // Líderes e supervisores podem acessar /admin/ministerios/[id]
    if (ministerioDetailRegex.test(pathname) && (role === "lider" || role === "supervisor")) {
      return NextResponse.next()
    }

    // /admin/ministerios (gerenciar) é admin only
    if (pathname === "/admin/ministerios" && role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Páginas restritas a admin
    if (adminOnlyPaths.some((p) => pathname.startsWith(p)) && role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/minha-area/:path*"],
}
