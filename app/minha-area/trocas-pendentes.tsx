"use client"

import useSWR from "swr"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, Check, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function TrocasPendentes() {
  const { data: session } = useSession()
  const { data: trocas, mutate } = useSWR("/api/escalas/trocas", fetcher)
  const [loading, setLoading] = useState<string | null>(null)

  if (!trocas?.length) return null

  const userId = session?.user?.id

  const handleResponder = async (id: string, status: "aceita" | "recusada") => {
    setLoading(id)
    const res = await fetch(`/api/escalas/trocas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast({ title: status === "aceita" ? "Troca aceita!" : "Troca recusada" })
      mutate()
    } else {
      const err = await res.json()
      toast({ title: err.error || "Erro", variant: "destructive" })
    }
    setLoading(null)
  }

  return (
    <Card className="rounded-2xl border-orange-200 bg-orange-50/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ArrowLeftRight className="h-4 w-4 text-orange-500" />
          Trocas Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trocas.map((t: any) => {
          const isDestinatario = t.destinatario_id === userId
          const outraPessoa = isDestinatario ? t.solicitante_nome : t.destinatario_nome
          const minhaData = isDestinatario ? t.data_destinatario : t.data_solicitante
          const outraData = isDestinatario ? t.data_solicitante : t.data_destinatario

          return (
            <div key={t.id} className="border rounded-lg p-3 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{t.ministerio_icone}</span>
                <p className="text-sm font-medium flex-1">{t.ministerio}</p>
              </div>
              <p className="text-xs text-gray-600">
                <span className="font-medium">{outraPessoa}</span> quer trocar{" "}
                <span className="font-medium">{new Date(outraData).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}</span>
                {" ↔ "}
                <span className="font-medium">{new Date(minhaData).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}</span>
              </p>
              {isDestinatario ? (
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-xs flex-1" disabled={loading === t.id} onClick={() => handleResponder(t.id, "aceita")}>
                    {loading === t.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />} Aceitar
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs flex-1 text-red-600 border-red-200" disabled={loading === t.id} onClick={() => handleResponder(t.id, "recusada")}>
                    <X className="h-3 w-3 mr-1" /> Recusar
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-orange-600">Aguardando resposta...</p>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
