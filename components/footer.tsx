"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"

export default function Footer() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <nav className="flex justify-center gap-6 mb-4">
          <Link href="/cadastro" className="hover:underline">
            Cadastro de Visitantes
          </Link>
          <Link href="/admin" className="hover:underline">
            Área Administrativa
          </Link>
          <Link href="/responsaveis" className="hover:underline">
            Gerentes
          </Link>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1 text-white">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          )}
        </nav>
        <p>© {new Date().getFullYear()} Primeira Igreja Batista de Roraima. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
