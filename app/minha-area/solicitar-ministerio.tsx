"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Check, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function SolicitarMinisterio() {
  const { data: ministerios } = useSWR("/api/ministerios", fetcher)
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    const res = await fetch("/api/users/me/ministerios", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ministerio_id: selected })
    })
    setLoading(false)
    if (res.ok) {
      setDone(true)
      toast({ title: "Solicitação enviada!", description: "Aguarde a aprovação do líder do ministério." })
    }
  }

  if (done) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <Check className="h-6 w-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-green-800">Solicitação enviada!</p>
          <p className="text-xs text-green-700">Aguarde a aprovação do líder.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <p className="font-medium text-sm">Você faz parte de algum ministério?</p>
        <p className="text-xs text-muted-foreground">Selecione o ministério que você participa:</p>
        <div className="grid grid-cols-1 gap-2">
          {ministerios?.map((m: any) => (
            <button key={m.id} onClick={() => setSelected(m.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${selected === m.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
              <span className="text-xl">{m.icone || "⛪"}</span>
              <span className="text-sm font-medium">{m.nome}</span>
            </button>
          ))}
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={!selected || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Solicitar participação
        </Button>
      </CardContent>
    </Card>
  )
}
