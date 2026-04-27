"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const handleSignIn = async (mode: "login" | "signup") => {
    await fetch("/api/auth/set-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    })
    signIn("google", { callbackUrl: "/minha-area" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Área Restrita</CardTitle>
        <CardDescription>Acesse o sistema com sua conta Google</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error === "no_account" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Não existe conta criada para esse usuário. Tente uma conta diferente ou crie uma nova conta.
          </div>
        )}
        <Button className="w-full" onClick={() => handleSignIn("login")}>
          Entrar na minha conta
        </Button>
        <Button className="w-full" variant="outline" onClick={() => handleSignIn("signup")}>
          Criar conta
        </Button>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-md px-4 py-12">
        <Suspense>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  )
}
