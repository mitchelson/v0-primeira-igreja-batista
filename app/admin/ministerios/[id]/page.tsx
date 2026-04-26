"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Check, X, AlertCircle, Crown, Users, Tag, CalendarDays, Share2, Bell, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MinisterioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const { data: ministerio, mutate: mutateMin } = useSWR(`/api/ministerios/${id}`, fetcher)
  const { data: funcoes, mutate: mutateFuncoes } = useSWR(`/api/ministerios/${id}/funcoes`, fetcher)
  const { data: eventos } = useSWR("/api/eventos", fetcher)
  const [novaFuncao, setNovaFuncao] = useState("")

  // Escala state
  const [eventoId, setEventoId] = useState("")
  const { data: escalas, mutate: mutateEscalas } = useSWR(eventoId ? `/api/escalas?evento_id=${eventoId}` : null, fetcher)
  const [addOpen, setAddOpen] = useState(false)
  const [addUser, setAddUser] = useState("")
  const [addFuncao, setAddFuncao] = useState("")
  const [conflictDialog, setConflictDialog] = useState<any>(null)
  const [notifying, setNotifying] = useState(false)

  const isAdmin = session?.user?.role === "admin"
  const lider = ministerio?.membros?.filter((m: any) => m.is_lider) || []
  const membros = ministerio?.membros || []
  const minEscalas = escalas?.filter((e: any) => e.ministerio_id === id) || []

  const futureEventos = eventos?.filter((e: any) => new Date(e.data) >= new Date(new Date().toDateString()))
    .sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime())

  const handleAddFuncao = async () => {
    if (!novaFuncao.trim()) return
    const res = await fetch(`/api/ministerios/${id}/funcoes`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novaFuncao.trim() }),
    })
    if (res.ok) { toast({ title: "Função criada" }); mutateFuncoes(); setNovaFuncao("") }
    else if (res.status === 409) toast({ title: "Função já existe", variant: "destructive" })
  }

  const handleRemoveFuncao = async (funcaoId: string) => {
    await fetch(`/api/ministerios/${id}/funcoes`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcao_id: funcaoId }),
    })
    toast({ title: "Função removida" }); mutateFuncoes()
  }

  const handleEscalar = async () => {
    if (!eventoId || !addUser) return
    const res = await fetch("/api/escalas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento_id: eventoId, ministerio_id: id, user_id: addUser, funcao: addFuncao || null }),
    })
    if (res.status === 409) { setConflictDialog(await res.json()); return }
    if (res.ok) {
      const data = await res.json()
      if (data.warning) toast({ title: "⚠️ Aviso", description: data.warning })
      else toast({ title: "Membro escalado" })
      mutateEscalas(); setAddOpen(false); setAddUser(""); setAddFuncao("")
    }
  }

  const handleRemoveEscala = async (escalaId: string) => {
    await fetch(`/api/escalas/${escalaId}`, { method: "DELETE" })
    toast({ title: "Removido da escala" }); mutateEscalas()
  }

  const handleStatus = async (escalaId: string, status: string) => {
    await fetch(`/api/escalas/${escalaId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    toast({ title: `Status: ${status}` }); mutateEscalas()
  }

  const selectedEvento = futureEventos?.find((e: any) => e.id === eventoId)

  const handleShareWhatsApp = () => {
    if (!selectedEvento || minEscalas.length === 0) return
    const data = new Date(selectedEvento.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    let text = `📋 *Escala - ${ministerio.nome}*\n📅 ${selectedEvento.titulo} — ${data}${selectedEvento.horario ? ` às ${selectedEvento.horario}` : ""}\n\n`
    minEscalas.forEach((e: any) => { text += `• ${e.user_nome}${e.funcao ? ` (${e.funcao})` : ""}\n` })

    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank")
    }
  }

  const handleNotifyEscalados = async () => {
    if (!eventoId || minEscalas.length === 0) return
    setNotifying(true)
    try {
      const res = await fetch("/api/escalas/notify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evento_id: eventoId, ministerio_id: id }),
      })
      const data = await res.json()
      if (res.ok) toast({ title: "Notificações enviadas", description: `${data.total} escalado(s) notificado(s)` })
      else toast({ title: "Erro ao notificar", description: data.error, variant: "destructive" })
    } catch { toast({ title: "Erro ao notificar", variant: "destructive" }) }
    finally { setNotifying(false) }
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { confirmado: "bg-green-100 text-green-700", pendente: "bg-yellow-100 text-yellow-700", recusado: "bg-red-100 text-red-700" }
    return map[s] || ""
  }

  if (!ministerio) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{ministerio.icone}</span>
        <div>
          <h1 className="text-2xl font-bold">{ministerio.nome}</h1>
          {ministerio.descricao && <p className="text-muted-foreground text-sm">{ministerio.descricao}</p>}
        </div>
        <div className="ml-auto h-6 w-6 rounded-full border" style={{ backgroundColor: ministerio.cor }} />
      </div>

      <Tabs defaultValue="membros">
        <TabsList>
          <TabsTrigger value="membros"><Users className="h-4 w-4 mr-1" />Membros</TabsTrigger>
          <TabsTrigger value="funcoes"><Tag className="h-4 w-4 mr-1" />Funções</TabsTrigger>
          <TabsTrigger value="escala"><CalendarDays className="h-4 w-4 mr-1" />Escala</TabsTrigger>
        </TabsList>

        {/* Membros */}
        <TabsContent value="membros" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {lider.map((l: any) => (
            <Card key={l.user_id} className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={l.foto_url} />
                  <AvatarFallback>{l.nome?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{l.nome}</p>
                  <Badge className="mt-1 bg-amber-100 text-amber-700 gap-1 text-xs"><Crown className="h-3 w-3" />Líder</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {membros.filter((m: any) => !m.is_lider).map((m: any) => (
            <Card key={m.user_id}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={m.foto_url} />
                  <AvatarFallback>{m.nome?.[0]}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{m.nome}</p>
              </CardContent>
            </Card>
          ))}
          </div>
          {membros.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum membro neste ministério.</p>}
        </TabsContent>

        {/* Funções */}
        <TabsContent value="funcoes" className="space-y-4 mt-4">
          {isAdmin && (
            <div className="flex gap-2">
              <Input placeholder="Nova função (ex: vocal, guitarra)" value={novaFuncao} onChange={e => setNovaFuncao(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddFuncao()} />
              <Button onClick={handleAddFuncao} disabled={!novaFuncao.trim()}><Plus className="h-4 w-4" /></Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {funcoes?.map((f: any) => (
              <Badge key={f.id} variant="secondary" className="text-sm gap-1 py-1 px-3">
                {f.nome}
                {isAdmin && (
                  <button onClick={() => handleRemoveFuncao(f.id)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {(!funcoes || funcoes.length === 0) && <p className="text-muted-foreground text-sm">Nenhuma função cadastrada.</p>}
          </div>
        </TabsContent>

        {/* Escala */}
        <TabsContent value="escala" className="space-y-4 mt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label>Evento</Label>
              <Select value={eventoId} onValueChange={setEventoId}>
                <SelectTrigger><SelectValue placeholder="Selecione um evento" /></SelectTrigger>
                <SelectContent>
                  {futureEventos?.map((ev: any) => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.titulo} — {new Date(ev.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}{ev.horario ? ` ${ev.horario}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {eventoId && (
              <Button onClick={() => { setAddOpen(true); setAddUser(""); setAddFuncao("") }}>
                <Plus className="h-4 w-4 mr-1" />Escalar
              </Button>
            )}
          </div>

          {eventoId && minEscalas.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
                <Share2 className="h-4 w-4 mr-1" />Compartilhar
              </Button>
              <Button variant="outline" size="sm" onClick={handleNotifyEscalados} disabled={notifying}>
                {notifying ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Bell className="h-4 w-4 mr-1" />}
                Notificar
              </Button>
            </div>
          )}

          {eventoId && minEscalas.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Nenhum membro escalado para este evento.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {minEscalas.map((e: any) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2 relative">
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-destructive" onClick={() => handleRemoveEscala(e.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                <Avatar className="h-14 w-14">
                  <AvatarImage src={e.foto_url} />
                  <AvatarFallback>{e.user_nome?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{e.user_nome}</p>
                  {e.funcao && <p className="text-xs text-muted-foreground">{e.funcao}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${statusBadge(e.status)}`}>{e.status}</span>
                  {e.status === "pendente" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600" onClick={() => handleStatus(e.id, "confirmado")}><Check className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={() => handleStatus(e.id, "recusado")}><X className="h-3 w-3" /></Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog escalar membro */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Escalar Membro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Membro</Label>
              <Select value={addUser} onValueChange={setAddUser}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {membros.map((m: any) => (
                    <SelectItem key={m.user_id} value={m.user_id}>{m.nome}{m.is_lider ? " ★" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Função</Label>
              <Select value={addFuncao} onValueChange={setAddFuncao}>
                <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                <SelectContent>
                  {funcoes?.map((f: any) => (
                    <SelectItem key={f.id} value={f.nome}>{f.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleEscalar} disabled={!addUser}>Escalar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog conflito */}
      <Dialog open={!!conflictDialog} onOpenChange={() => setConflictDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="h-5 w-5" />Conflito de Escala</DialogTitle></DialogHeader>
          <p className="text-sm">{conflictDialog?.message}</p>
          <Button variant="outline" onClick={() => setConflictDialog(null)}>Entendi</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
