"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function EscalaActions({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const update = async (newStatus: string) => {
    setLoading(newStatus)
    try {
      await fetch(`/api/escalas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  if (status === "confirmado")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs font-medium px-3 py-1.5">
        <Check className="h-3.5 w-3.5 mr-1" />Confirmado
      </Badge>
    )

  if (status === "recusado")
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 text-xs font-medium px-3 py-1.5">
        <X className="h-3.5 w-3.5 mr-1" />Recusado
      </Badge>
    )

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        disabled={loading !== null}
        onClick={() => update("confirmado")}
        className="h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
      >
        {loading === "confirmado" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
        <span className="sr-only">Confirmar</span>
      </Button>
      <Button
        size="icon"
        disabled={loading !== null}
        onClick={() => update("recusado")}
        className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm"
      >
        {loading === "recusado" ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
        <span className="sr-only">Recusar</span>
      </Button>
    </div>
  )
}
