"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, RefreshCw } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr"
import { useEffect, useState } from "react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Header() {
  const { data: session } = useSession()
  const { data: config } = useSWR("/api/config", fetcher)

  const menuMinisterioId = config?.menu_ministerio_id
  const userMinisterios: string[] = session?.user?.ministerioIds ?? []
  const isAdmin = session?.user?.role === "admin"

  // Admin always sees menus; others need to belong to the configured ministry
  const showMenus = isAdmin || !menuMinisterioId || userMinisterios.includes(menuMinisterioId)

  const [isPwa, setIsPwa] = useState(false)
  useEffect(() => {
    setIsPwa(window.matchMedia("(display-mode: standalone)").matches)
  }, [])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/pib-logo-black.png" alt="PIB Roraima" width={120} height={40} className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {showMenus && (
            <>
              <Link href="/cadastro" className="hover:underline">Cadastro</Link>
              <Link href="/admin" className="hover:underline">Administracao</Link>
            </>
          )}
          {session && (
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {isPwa && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Recarregar</span>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {showMenus && (
                <>
                  <Link href="/cadastro" className="px-2 py-1 hover:underline">Cadastro</Link>
                  <Link href="/admin" className="px-2 py-1 hover:underline">Administracao</Link>
                </>
              )}
              {session && (
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1 justify-start px-2">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Sair</span>
                </Button>
              )}
            </nav>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
