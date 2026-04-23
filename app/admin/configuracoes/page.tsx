"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Settings } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: ministerios } = useSWR("/api/ministerios", fetcher)
  const { data: config, mutate } = useSWR("/api/config", fetcher)
  const [menuMinisterioId, setMenuMinisterioId] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (config?.menu_ministerio_id) setMenuMinisterioId(config.menu_ministerio_id)
  }, [config])

  if (session?.user?.role !== "admin") {
    router.push("/admin")
    return null
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chave: "menu_ministerio_id", valor: menuMinisterioId }),
      })
      mutate()
      toast({ title: "Configuração salva" })
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async () => {
    setSaving(true)
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chave: "menu_ministerio_id", valor: "" }),
      })
      setMenuMinisterioId("")
      mutate()
      toast({ title: "Restrição removida — menus visíveis para todos" })
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const ativos = ministerios?.filter((m: any) => m.ativo) ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Visibilidade dos Menus
          </CardTitle>
          <CardDescription>
            Selecione qual ministério deve ter acesso aos menus Cadastro e Administração.
            Apenas membros desse ministério (e admins) verão esses menus. Se nenhum ministério for selecionado, os menus ficam visíveis para todos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ministério com acesso</label>
            <Select value={menuMinisterioId} onValueChange={setMenuMinisterioId}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Selecione um ministério" />
              </SelectTrigger>
              <SelectContent>
                {ativos.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.icone} {m.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !menuMinisterioId}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            {menuMinisterioId && (
              <Button variant="outline" onClick={handleClear} disabled={saving}>
                Remover restrição
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
