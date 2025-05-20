"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const success = login(password)

      if (!success) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Senha incorreta. Tente novamente.",
        })
      }

      setIsLoading(false)
    }, 500) // Pequeno delay para simular verificação
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Área Restrita</CardTitle>
        <CardDescription>Digite a senha para acessar esta área</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
