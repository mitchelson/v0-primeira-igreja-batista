"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, X, Crown, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { RoleBadges, type RoleBadgeItem } from "@/components/role-badges"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const GLOBAL_ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "supervisor", label: "Supervisor" },
  { value: "membro", label: "Membro" },
  { value: "congregado", label: "Congregado" },
  { value: "visitante", label: "Visitante" },
]

export default function MembrosAdminPage() {
  const { data: users, mutate } = useSWR("/api/users", fetcher)
  const { data: ministerios } = useSWR("/api/ministerios", fetcher)
  const [search, setSearch] = useState("")
  const [filterMin, setFilterMin] = useState("all")
  const [editUser, setEditUser] = useState<any>(null)
  const [addMinId, setAddMinId] = useState("")
  const [editNome, setEditNome] = useState("")
  const [addRoleName, setAddRoleName] = useState("membro")
  const [addRoleMinistry, setAddRoleMinistry] = useState<string>("")

  const filtered = users?.filter((u: any) => {
    const matchSearch = !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchMin = filterMin === "all" ? true
      : filterMin === "none" ? (!u.ministerios || u.ministerios.length === 0)
      : u.ministerios?.some((m: any) => m.ministerio_id === filterMin)
    return matchSearch && matchMin
  })

  const refreshEditUser = async (id: string) => {
    await mutate()
    const res = await fetch("/api/users")
    const list = await res.json()
    const fresh = list.find((u: any) => u.id === id)
    if (fresh) setEditUser(fresh)
  }

  const handleUpdate = async (id: string, data: any) => {
    await fetch("/api/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) })
    toast({ title: "Usuário atualizado" })
    await refreshEditUser(id)
  }

  const handleAddMinisterio = async (userId: string) => {
    if (!addMinId) return
    await fetch("/api/users/ministerios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: addMinId }) })
    toast({ title: "Ministério vinculado" })
    setAddMinId("")
    await refreshEditUser(userId)
  }

  const handleRemoveMinisterio = async (userId: string, ministerioId: string) => {
    await fetch("/api/users/ministerios", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: ministerioId }) })
    toast({ title: "Ministério desvinculado" })
    await refreshEditUser(userId)
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    toast({ title: "Usuário deletado" }); setEditUser(null); mutate()
  }

  const handleToggleLider = async (userId: string, ministerioId: string, isLider: boolean) => {
    await fetch("/api/users/ministerios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, ministerio_id: ministerioId, is_lider: !isLider }) })
    toast({ title: isLider ? "Removido como líder" : "Promovido a líder" })
    await refreshEditUser(userId)
  }

  const handleAddRole = async (userId: string) => {
    const isContextual = addRoleName === "lider" && addRoleMinistry
    const body: any = { role_name: addRoleName }
    if (isContextual) body.ministerio_id = addRoleMinistry

    const res = await fetch(`/api/accounts/${userId}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast({ title: "Erro ao adicionar papel", description: err.error || err.message, variant: "destructive" })
      return
    }
    toast({ title: "Papel adicionado" })
    setAddRoleName("membro")
    setAddRoleMinistry("")
    await refreshEditUser(userId)
  }

  const handleRemoveRole = async (userId: string, role: RoleBadgeItem) => {
    const body: any = {
      role_name: role.role_name,
      context_id: role.context_id || null,
    }
    if (role.context_type === "ministry" && role.context_id) {
      // resolve ministry id from contexts via name match in ministerios list when needed
      const min = ministerios?.find((m: any) => m.nome === role.context_name)
      if (min) body.ministerio_id = min.id
    }
    const res = await fetch(`/api/accounts/${userId}/roles`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      toast({ title: "Erro ao remover papel", variant: "destructive" })
      return
    }
    toast({ title: "Papel removido" })
    await refreshEditUser(userId)
  }

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
          <Card key={u.id} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => { setEditUser(u); setEditNome(u.nome) }}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <Avatar className="h-14 w-14">
                <AvatarImage src={u.foto_url} />
                <AvatarFallback>{u.nome?.[0]}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <p className="font-medium text-sm truncate max-w-full">{u.nome}</p>
                <p className="text-[11px] text-muted-foreground truncate max-w-full">{u.email}</p>
                <div className="mt-1 flex justify-center">
                  <RoleBadges roles={u.roles} legacyRole={u.role} size="xs" className="justify-center" />
                </div>
                {!u.ativo && <Badge variant="destructive" className="text-xs mt-1">Inativo</Badge>}
              </div>
              {u.ministerios?.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  {u.ministerios.map((m: any) => (
                    <Badge key={m.ministerio_id} variant="outline" className="text-[10px] gap-1">
                      {m.nome}
                      {m.is_lider && <Crown className="h-3 w-3 text-amber-500" />}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editUser} onOpenChange={(v) => { if (!v) setEditUser(null) }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar membro</DialogTitle>
            {editUser?.email && <p className="text-sm text-muted-foreground">{editUser.email}</p>}
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome do membro" />
                  <Button size="sm" disabled={!editNome.trim() || editNome === editUser.nome} onClick={() => { handleUpdate(editUser.id, { nome: editNome }); setEditUser({ ...editUser, nome: editNome }) }}>
                    Salvar
                  </Button>
                </div>
              </div>

              <div>
                <Label>Papéis</Label>
                <div className="space-y-2 mt-2">
                  {(editUser.roles?.length ? editUser.roles : [{ role_name: editUser.role }]).map((role: RoleBadgeItem, idx: number) => (
                    <div key={`${role.role_name}-${role.context_id || "g"}-${idx}`} className="flex items-center justify-between text-sm border rounded p-2 gap-2">
                      <RoleBadges roles={[role]} size="xs" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive shrink-0"
                        onClick={() => handleRemoveRole(editUser.id, role)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex gap-2">
                    <Select value={addRoleName} onValueChange={(v) => { setAddRoleName(v); if (v !== "lider") setAddRoleMinistry("") }}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Papel" /></SelectTrigger>
                      <SelectContent>
                        {GLOBAL_ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                        <SelectItem value="lider">Líder (com ministério)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleAddRole(editUser.id)} disabled={addRoleName === "lider" && !addRoleMinistry}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {addRoleName === "lider" && (
                    <Select value={addRoleMinistry} onValueChange={setAddRoleMinistry}>
                      <SelectTrigger><SelectValue placeholder="Ministério do líder" /></SelectTrigger>
                      <SelectContent>
                        {ministerios?.map((m: any) => (
                          <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Papéis globais (admin, membro…) aplicam em todo o sistema. Líder exige um ministério.
                  </p>
                </div>
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

              <div className="pt-2 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full gap-2">
                      <Trash2 className="h-4 w-4" /> Deletar usuário
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar {editUser.nome}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação é irreversível. O usuário e todos os seus dados serão removidos permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(editUser.id)}>
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
