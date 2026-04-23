"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function EscalaActions({ id, status }: { id: string; status: string }) {
  const router = useRouter()

  const update = async (newStatus: string) => {
    await fetch(`/api/escalas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
  }

  if (status === "confirmado") return <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Confirmado</span>
  if (status === "recusado") return <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Recusado</span>

  return (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" className="h-8 text-green-600" onClick={() => update("confirmado")}>
        <Check className="h-3.5 w-3.5 mr-1" />Confirmar
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-red-600" onClick={() => update("recusado")}>
        <X className="h-3.5 w-3.5 mr-1" />Recusar
      </Button>
    </div>
  )
}
