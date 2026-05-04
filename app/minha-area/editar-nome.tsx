"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function EditarNome({ nomeAtual }: { nomeAtual: string }) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState(nomeAtual)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!nome.trim() || nome.trim() === nomeAtual) { setOpen(false); return }
    setLoading(true)
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    })
    setLoading(false)
    if (res.ok) {
      toast({ title: "Nome atualizado com sucesso" })
      setOpen(false)
      router.refresh()
    } else {
      toast({ title: "Erro ao atualizar nome", variant: "destructive" })
    }
  }

  return (
    <>
      <button
        onClick={() => { setNome(nomeAtual); setOpen(true) }}
        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Editar nome"
      >
        <Pencil className="h-4 w-4 inline" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar nome</DialogTitle>
          </DialogHeader>
          <Input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            onKeyDown={e => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading || !nome.trim()}>
              {loading ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
