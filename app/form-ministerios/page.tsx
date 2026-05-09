"use client"

import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Header from "@/components/header"
import { CheckSquare, Square, Lock } from "lucide-react"

type Ministerio = { id: string; nome: string; icone: string; cor: string; descricao: string | null; form_obrigatorio: boolean }

export default function FormMinisteriosPage() {
  const { data: session, status } = useSession()
  const [ministerios, setMinistreios] = useState<Ministerio[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [existing, setExisting] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch("/api/ministerios").then(r => r.json()).then((data: Ministerio[]) => {
      setMinistreios(data)
      // Pre-select required ministries immediately
      const obrigatorios = data.filter(m => m.form_obrigatorio).map(m => m.id)
      if (obrigatorios.length > 0) {
        setSelected(prev => Array.from(new Set([...prev, ...obrigatorios])))
      }
    })
  }, [])

  useEffect(() => {
    if (status !== "authenticated") { setLoading(false); return }
    fetch("/api/form-ministerios")
      .then(r => r.json())
      .then(d => {
        if (d.ministerios) {
          setExisting(d.ministerios)
          setSelected(d.ministerios)
        }
      })
      .finally(() => setLoading(false))
  }, [status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    const handleSignIn = async (mode: "login" | "signup") => {
      await fetch("/api/auth/set-mode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode }) })
      signIn("google", { callbackUrl: "/form-ministerios" })
    }
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="mx-auto max-w-md px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Formulário dos Ministérios</CardTitle>
              <CardDescription>Você precisa estar logado para responder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => handleSignIn("login")}>Entrar na minha conta</Button>
              <Button className="w-full" variant="outline" onClick={() => handleSignIn("signup")}>Criar conta</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-6">
          <Card>
            <CardContent className="py-10 text-center space-y-3">
              <p className="text-4xl">✅</p>
              <p className="text-lg font-semibold text-green-800">Resposta enviada com sucesso!</p>
              <p className="text-sm text-muted-foreground">
                Você selecionou {selected.length} ministério{selected.length !== 1 ? "s" : ""}.
              </p>
              <a href="/minha-area" className="block text-center text-sm text-primary underline mt-3">
                Ir para Minha Área
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const toggle = (m: Ministerio) => {
    if (m.form_obrigatorio) return
    setSelected(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])
  }

  const submit = async () => {
    if (selected.length === 0) return
    setSubmitting(true)
    const res = await fetch("/api/form-ministerios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ministerios: selected }),
    })
    if (res.ok) setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Formulário dos Ministérios</CardTitle>
            <CardDescription>Semeadura 2026.1 — Selecione os ministérios em que deseja servir. Você pode marcar mais de um.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {existing && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                Você já respondeu este formulário. Pode atualizar sua resposta abaixo.
              </div>
            )}
            {ministerios.filter((m: any) => m.ativo).map((m) => {
              const isSelected = selected.includes(m.id)
              const isObrigatorio = !!m.form_obrigatorio
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m)}
                  disabled={isObrigatorio}
                  className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-colors ${
                    isObrigatorio
                      ? "border-primary/40 bg-primary/5 cursor-default"
                      : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-muted/50"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isObrigatorio
                      ? <Lock className="h-5 w-5 text-primary/60" />
                      : isSelected
                        ? <CheckSquare className="h-5 w-5 text-primary" />
                        : <Square className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                  <div
                    className="shrink-0 flex items-center justify-center text-xl w-9 h-9 rounded-full"
                    style={{ backgroundColor: m.cor ? `${m.cor}20` : "#f3f4f6" }}
                  >
                    {m.icone || "⛪"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isSelected || isObrigatorio ? "text-primary" : "text-gray-900"}`}>
                      {m.nome}
                    </p>
                    {isObrigatorio && (
                      <p className="text-[11px] text-primary/70 mt-0.5">participação obrigatória</p>
                    )}
                    {!isObrigatorio && m.descricao && (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.descricao}</p>
                    )}
                  </div>
                </button>
              )
            })}

            <div className="pt-2">
              <Button
                className="w-full"
                onClick={submit}
                disabled={selected.length === 0 || submitting}
              >
                {submitting ? "Enviando..." : `Confirmar${selected.length > 0 ? ` (${selected.length} selecionado${selected.length !== 1 ? "s" : ""})` : ""}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
