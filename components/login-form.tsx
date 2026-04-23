"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  return (
    <Card className="max-w-md mx-auto">
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
  )
}
