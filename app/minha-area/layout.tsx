"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Newspaper, ClipboardList } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MinhaAreaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const tabs = [
    { href: "/feed", label: "Feed", icon: Newspaper },
    { href: "/minha-area", label: "Serviço", icon: ClipboardList },
  ]

  return (
    <div className="pb-16 md:pb-0">
      {children}
      {/* Tab bar mobile */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-14">
          {tabs.map((tab) => {
            const active = tab.href === "/minha-area"
              ? pathname === "/minha-area"
              : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 text-[11px] ${active ? "text-black font-semibold" : "text-gray-400"}`}
              >
                <tab.icon className={`h-5 w-5 ${active ? "text-black" : "text-gray-400"}`} />
                {tab.label}
              </Link>
            )
          })}
          {/* Perfil tab com foto */}
          <Link
            href="/minha-area/perfil"
            className={`flex flex-col items-center gap-0.5 text-[11px] ${pathname.startsWith("/minha-area/perfil") ? "text-black font-semibold" : "text-gray-400"}`}
          >
            <Avatar className={`h-5 w-5 ${pathname.startsWith("/minha-area/perfil") ? "ring-2 ring-black" : ""}`}>
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback className="text-[8px]">{session?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            Perfil
          </Link>
        </div>
      </nav>
    </div>
  )
}
