"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserCog, Plus, X, Crown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MembrosAdminPage() {
  const { data: users, mutate } = useSWR("/api/users", fetcher)
  const { data: ministerios } = useSWR("/api/ministerios", fetcher)
  const [search, setSearch] = useState("")
  const [filterMin, setFilterMin] = useState("all")
  const [editUser, setEditUser] = useState<any>(null)
  const [addMinId, setAddMinId] = useState("")

  const filtered = users?.filter((u: any) => {
    const matchSearch = !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchMin = filterMin === "all" ? true
      : filterMin === "none" ? (!u.ministerios || u.ministerios.length === 0)
      : u.ministerios?.some((m: any) => m.ministerio_id === filterMin)
    return matchSearch && matchMin
  })

  const handleUpdate = async (id: string, data: any) => {
    await fetch("/api/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) })
    toast({ title: "Usuário atualizado" }); mutate()
  }

  const handleAddMinisterio = async (userId: string) => {
    if (!addMinId) return
    await fetch("/api/users/ministerios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: addMinId }) })
    toast({ title: "Ministério vinculado" }); mutate(); setAddMinId("")
  }

  const handleRemoveMinisterio = async (userId: string, ministerioId: string) => {
    await fetch("/api/users/ministerios", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: ministerioId }) })
    toast({ title: "Ministério desvinculado" }); mutate()
  }

  const handleToggleLider = async (userId: string, ministerioId: string, isLider: boolean) => {
    await fetch("/api/users/ministerios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: ministerioId, is_lider: !isLider }) })
    toast({ title: isLider ? "Removido como líder" : "Promovido a líder" }); mutate()
  }

  const roleColor = (role: string) => role === "admin" ? "bg-red-100 text-red-700" : role === "supervisor" ? "bg-purple-100 text-purple-700" : role === "lider" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membros</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou email" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterMin} onValueChange={setFilterMin}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Ministério" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="none">Sem ministério</SelectItem>
            {ministerios?.map((m: any) => (
              <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered && (
        <p className="text-sm text-muted-foreground">{filtered.length} membro{filtered.length !== 1 ? "s" : ""}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered?.map((u: any) => (
          <Card key={u.id} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setEditUser(u)}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <Avatar className="h-14 w-14">
                <AvatarImage src={u.foto_url} />
                <AvatarFallback>{u.nome?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm truncate max-w-full">{u.nome}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded ${roleColor(u.role)}`}>{u.role}</span>
                {!u.ativo && <Badge variant="destructive" className="text-xs ml-1">Inativo</Badge>}
              </div>
              {u.ministerios?.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  {u.ministerios.map((m: any) => (
                    <Badge key={m.ministerio_id} variant="outline" className="text-[10px]">
                      {m.nome}{m.is_lider ? " ★" : ""}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editUser} onOpenChange={(v) => { if (!v) setEditUser(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar {editUser?.nome}</DialogTitle></DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <Label>Papel</Label>
                <Select value={editUser.role} onValueChange={v => { handleUpdate(editUser.id, { role: v }); setEditUser({ ...editUser, role: v }) }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="lider">Líder</SelectItem>
                    <SelectItem value="membro">Membro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Ativo</Label>
                <Switch checked={editUser.ativo} onCheckedChange={v => { handleUpdate(editUser.id, { ativo: v }); setEditUser({ ...editUser, ativo: v }) }} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Permite escala múltipla</Label>
                <Switch checked={editUser.permite_escala_multipla} onCheckedChange={v => { handleUpdate(editUser.id, { permite_escala_multipla: v }); setEditUser({ ...editUser, permite_escala_multipla: v }) }} />
              </div>

              <div>
                <Label>Ministérios</Label>
                <div className="space-y-2 mt-2">
                  {editUser.ministerios?.map((m: any) => (
                    <div key={m.ministerio_id} className="flex items-center justify-between text-sm border rounded p-2 gap-2">
                      <span className="truncate min-w-0">{m.nome}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleToggleLider(editUser.id, m.ministerio_id, m.is_lider)}>
                          {m.is_lider ? <><Crown className="h-3 w-3 sm:mr-1" /><span className="hidden sm:inline">Remover líder</span></> : <><Crown className="h-3 w-3 sm:mr-1" /><span className="hidden sm:inline">Promover líder</span></>}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveMinisterio(editUser.id, m.ministerio_id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={addMinId} onValueChange={setAddMinId}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Adicionar ministério" /></SelectTrigger>
                    <SelectContent>
                      {ministerios?.filter((m: any) => !editUser.ministerios?.some((em: any) => em.ministerio_id === m.id)).map((m: any) => (
                        <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => handleAddMinisterio(editUser.id)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
