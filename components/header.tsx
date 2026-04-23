"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Header() {
  const { data: session } = useSession()
  const { data: config } = useSWR("/api/config", fetcher)

  const menuMinisterioId = config?.menu_ministerio_id
  const userMinisterios: string[] = session?.user?.ministerioIds ?? []
  const isAdmin = session?.user?.role === "admin"

  // Admin always sees menus; others need to belong to the configured ministry
  const showMenus = isAdmin || !menuMinisterioId || userMinisterios.includes(menuMinisterioId)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          PIB Roraima
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

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
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
    </header>
  )
}
