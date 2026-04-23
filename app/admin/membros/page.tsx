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
import { Search, UserCog, Plus, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MembrosAdminPage() {
  const { data: users, mutate } = useSWR("/api/users", fetcher)
  const { data: ministerios } = useSWR("/api/ministerios", fetcher)
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<any>(null)
  const [addMinId, setAddMinId] = useState("")

  const filtered = users?.filter((u: any) =>
    u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

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

  const roleColor = (role: string) => role === "admin" ? "bg-red-100 text-red-700" : role === "lider" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membros</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou email" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered?.map((u: any) => (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={u.foto_url} />
                  <AvatarFallback>{u.nome?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{u.nome}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${roleColor(u.role)}`}>{u.role}</span>
                    {!u.ativo && <Badge variant="destructive" className="text-xs">Inativo</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  {u.ministerios?.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {u.ministerios.map((m: any) => (
                        <Badge key={m.ministerio_id} variant="outline" className="text-xs">
                          {m.nome}{m.is_lider ? " ★" : ""}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditUser(u)}>
                  <UserCog className="h-4 w-4" />
                </Button>
              </div>
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
                    <div key={m.ministerio_id} className="flex items-center justify-between text-sm border rounded p-2">
                      <span>{m.nome}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleToggleLider(editUser.id, m.ministerio_id, m.is_lider)}>
                          {m.is_lider ? "Remover líder" : "Promover líder"}
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
