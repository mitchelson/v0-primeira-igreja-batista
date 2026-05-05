"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface RepertoireItem {
  nome: string
  tonalidade: string
  link: string
  observacoes: string
}

interface RepertoireFormProps {
  eventoId: string
  initialItems?: RepertoireItem[]
  onSaved?: () => void
  onCancel?: () => void
}

export function RepertoireForm({ eventoId, initialItems, onSaved, onCancel }: RepertoireFormProps) {
  const [items, setItems] = useState<RepertoireItem[]>(
    initialItems?.length ? initialItems : [{ nome: "", tonalidade: "", link: "", observacoes: "" }]
  )
  const [saving, setSaving] = useState(false)

  const update = (i: number, field: keyof RepertoireItem, value: string) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const add = () => setItems(prev => [...prev, { nome: "", tonalidade: "", link: "", observacoes: "" }])
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    const valid = items.filter(it => it.nome.trim())
    if (valid.length === 0) {
      toast({ title: "Adicione pelo menos uma música", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/repertorio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evento_id: eventoId, items: valid }),
      })
      if (res.ok) {
        toast({ title: "Repertório salvo" })
        onSaved?.()
      } else {
        const data = await res.json().catch(() => ({}))
        toast({ title: data.error || "Erro ao salvar", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">#{i + 1}</span>
            {items.length > 1 && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => remove(i)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <Input placeholder="Nome da música *" value={item.nome} onChange={e => update(i, "nome", e.target.value)} />
          <div className="flex gap-2">
            <Input placeholder="Tonalidade" className="w-24" value={item.tonalidade} onChange={e => update(i, "tonalidade", e.target.value)} />
            <Input placeholder="Link (YouTube/Spotify)" className="flex-1" value={item.link} onChange={e => update(i, "link", e.target.value)} />
          </div>
          <Input placeholder="Observações" value={item.observacoes} onChange={e => update(i, "observacoes", e.target.value)} />
        </div>
      ))}

      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="h-4 w-4 mr-1" /> Adicionar música
      </Button>

      <div className="flex gap-2">
        {onCancel && <Button variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>}
        <Button className="flex-1" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Salvar Repertório
        </Button>
      </div>
    </div>
  )
}
