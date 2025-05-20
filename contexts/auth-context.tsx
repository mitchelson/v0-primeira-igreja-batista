"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Senha hardcoded para acesso às áreas protegidas
const SENHA_ADMIN = "igreja123"

type AuthContextType = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const auth = localStorage.getItem("pib_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string) => {
    if (password === SENHA_ADMIN) {
      setIsAuthenticated(true)
      localStorage.setItem("pib_auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("pib_auth")
    router.push("/")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
