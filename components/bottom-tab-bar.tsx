"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Newspaper, ClipboardList, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BottomTabBar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role
  const showAdmin = role === "admin" || role === "lider" || role === "supervisor"

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-[52px]">
        <Link href="/feed" className={`flex flex-col items-center gap-0.5 text-[11px] ${pathname.startsWith("/feed") ? "text-black font-semibold" : "text-gray-400"}`}>
          <Newspaper className={`h-5 w-5 ${pathname.startsWith("/feed") ? "text-black" : "text-gray-400"}`} />
          Feed
        </Link>
        <Link href="/minha-area" className={`flex flex-col items-center gap-0.5 text-[11px] ${pathname === "/minha-area" ? "text-black font-semibold" : "text-gray-400"}`}>
          <ClipboardList className={`h-5 w-5 ${pathname === "/minha-area" ? "text-black" : "text-gray-400"}`} />
          Serviço
        </Link>
        {showAdmin && (
          <Link href="/admin" className={`flex flex-col items-center gap-0.5 text-[11px] ${pathname.startsWith("/admin") ? "text-black font-semibold" : "text-gray-400"}`}>
            <Shield className={`h-5 w-5 ${pathname.startsWith("/admin") ? "text-black" : "text-gray-400"}`} />
            Admin
          </Link>
        )}
        <Link href="/minha-area/perfil" className={`flex flex-col items-center gap-0.5 text-[11px] ${pathname.startsWith("/minha-area/perfil") ? "text-black font-semibold" : "text-gray-400"}`}>
          <Avatar className={`h-5 w-5 ${pathname.startsWith("/minha-area/perfil") ? "ring-2 ring-black" : ""}`}>
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="text-[8px]">{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          Perfil
        </Link>
      </div>
    </nav>
  )
}
