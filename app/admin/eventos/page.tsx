"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const tipos = ["Culto", "Conferência", "Especial", "Reunião", "Outro"]

export default function EventosAdminPage() {
  const { data: eventos, mutate } = useSWR("/api/eventos", fetcher)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ titulo: "", data: "", horario: "", descricao: "", tipo: "Culto" })

  const resetForm = () => { setForm({ titulo: "", data: "", horario: "", descricao: "", tipo: "Culto" }); setEditing(null) }

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST"
    const url = editing ? `/api/eventos/${editing.id}` : "/api/eventos"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      toast({ title: editing ? "Evento atualizado" : "Evento criado" })
      mutate(); setOpen(false); resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este evento e todas as escalas associadas?")) return
    await fetch(`/api/eventos/${id}`, { method: "DELETE" })
    toast({ title: "Evento excluído" }); mutate()
  }

  const openEdit = (ev: any) => {
    setForm({ titulo: ev.titulo, data: ev.data?.split("T")[0] || ev.data, horario: ev.horario || "", descricao: ev.descricao || "", tipo: ev.tipo })
    setEditing(ev); setOpen(true)
  }

  const tipoColor = (tipo: string) => {
    const map: Record<string, string> = { Culto: "bg-blue-100 text-blue-700", Conferência: "bg-purple-100 text-purple-700", Especial: "bg-amber-100 text-amber-700", Reunião: "bg-gray-100 text-gray-700" }
    return map[tipo] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" />Novo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar" : "Novo"} Evento</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} /></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1"><Label>Data</Label><Input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} /></div>
                <div className="flex-1"><Label>Horário</Label><Input type="time" value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} /></div>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Descrição</Label><Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSave}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventos?.map((ev: any) => {
          const d = new Date(ev.data)
          const dia = d.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })
          const mes = d.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "")
          return (
            <Card key={ev.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 text-primary min-w-[3rem] py-2 px-2">
                      <span className="text-lg font-bold leading-none">{dia}</span>
                      <span className="text-[10px] uppercase font-medium mt-0.5">{mes}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{ev.titulo}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {ev.horario && <span>{ev.horario}</span>}
                        <span className={`px-1.5 py-0.5 rounded ${tipoColor(ev.tipo)}`}>{ev.tipo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {ev.descricao && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ev.descricao}</p>}
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(ev)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(ev.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {eventos?.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">Nenhum evento cadastrado.</p>}
      </div>
    </div>
  )
}
