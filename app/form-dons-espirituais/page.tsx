"use client"

import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/header"
import { ANSWER_LABELS, TOTAL_QUESTIONS, GIFT_DESCRIPTIONS, getQuestionAtIndex } from "@/lib/dons-espirituais"
import type { GiftName } from "@/lib/dons-espirituais"

type GiftResult = { gift: GiftName; score: number; rank: number }

export default function FormDonsEspirituaisPage() {
  const { data: session, status } = useSession()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null))
  const [results, setResults] = useState<GiftResult[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (status !== "authenticated") { setLoading(false); return }
    fetch("/api/dons-espirituais")
      .then(r => r.json())
      .then(d => { if (d.results) setResults(d.results) })
      .finally(() => setLoading(false))
  }, [status])

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-muted/30"><Header /><div className="flex justify-center py-20"><p className="text-muted-foreground">Carregando...</p></div></div>
  }

  // Not logged in — show login buttons
  if (!session) {
    const handleSignIn = async (mode: "login" | "signup") => {
      await fetch("/api/auth/set-mode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode }) })
      signIn("google", { callbackUrl: "/form-dons-espirituais" })
    }
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="mx-auto max-w-md px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Teste de Dons Espirituais</CardTitle>
              <CardDescription>Você precisa estar logado para responder o teste</CardDescription>
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

  // Show results
  if (results && !started) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seus Dons Espirituais</CardTitle>
              <CardDescription>Os três primeiros tendem a ser os seus principais dons.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((r) => (
                <div key={r.gift} className={`flex items-center gap-3 rounded-lg border p-3 ${r.rank <= 3 ? "border-green-300 bg-green-50" : ""}`}>
                  <span className="text-sm font-bold text-muted-foreground w-6">{r.rank}°</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${r.rank <= 3 ? "text-green-800" : ""}`}>{r.gift}</p>
                    {r.rank <= 3 && <p className="text-xs text-muted-foreground mt-0.5">{GIFT_DESCRIPTIONS[r.gift]}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{r.score}</span>
                    <span className="text-xs text-muted-foreground">/12</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={() => { setResults(null); setAnswers(Array(TOTAL_QUESTIONS).fill(null)); setCurrent(0); setStarted(true) }}>
                Refazer o teste
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Teste de Dons Espirituais</CardTitle>
              <CardDescription>Descubra o seu chamado ministerial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Responda com calma, em espírito de oração. São <strong>76 questões</strong>.</p>
                <p>• Seja sincero. Não responda "como deveria ser"; responda "como é".</p>
                <p>• Não existe resposta errada.</p>
              </div>
              <Button className="w-full" onClick={() => setStarted(true)}>Começar o teste</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Question form
  const q = getQuestionAtIndex(current)
  const progress = ((current + (answers[current] !== null ? 1 : 0)) / TOTAL_QUESTIONS) * 100

  const selectAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[current] = value
    setAnswers(newAnswers)
  }

  const goNext = () => { if (current < TOTAL_QUESTIONS - 1) setCurrent(current + 1) }
  const goPrev = () => { if (current > 0) setCurrent(current - 1) }

  const submit = async () => {
    if (answers.some(a => a === null)) return
    setSubmitting(true)
    const res = await fetch("/api/dons-espirituais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    setResults(data.results)
    setStarted(false)
    setSubmitting(false)
  }

  const allAnswered = answers.every(a => a !== null)
  const isLast = current === TOTAL_QUESTIONS - 1

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Questão {current + 1} de {TOTAL_QUESTIONS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm leading-relaxed">{q.text}</p>
            <div className="grid gap-2">
              {ANSWER_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={`text-left text-sm rounded-lg border p-3 transition-colors ${answers[current] === i ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={goPrev} disabled={current === 0} className="flex-1">Anterior</Button>
          {isLast ? (
            <Button onClick={submit} disabled={!allAnswered || submitting} className="flex-1">
              {submitting ? "Calculando..." : "Ver Resultado"}
            </Button>
          ) : (
            <Button onClick={goNext} disabled={answers[current] === null} className="flex-1">Próxima</Button>
          )}
        </div>
      </div>
    </div>
  )
}
