"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Área Restrita</CardTitle>
            <CardDescription>Faça login com sua conta Google para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => signIn("google", { callbackUrl: "/admin" })}>
              Entrar com Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
