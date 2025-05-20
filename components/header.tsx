"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          PIB Roraima
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cadastro" className="hover:underline">
            Cadastro
          </Link>
          <Link href="/admin" className="hover:underline">
            Administração
          </Link>
          <Link href="/responsaveis" className="hover:underline">
            Gerentes
          </Link>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/cadastro" className="px-2 py-1 hover:underline">
                Cadastro
              </Link>
              <Link href="/admin" className="px-2 py-1 hover:underline">
                Administração
              </Link>
              <Link href="/responsaveis" className="px-2 py-1 hover:underline">
                Gerentes
              </Link>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1 justify-start px-2"
                >
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
