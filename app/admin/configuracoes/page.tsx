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
  const [feedMinisterioId, setFeedMinisterioId] = useState("")
  const [saving, setSaving] = useState("")

  useEffect(() => {
    if (config?.menu_ministerio_id) setMenuMinisterioId(config.menu_ministerio_id)
    if (config?.feed_ministerio_id) setFeedMinisterioId(config.feed_ministerio_id)
  }, [config])

  if (session?.user?.role !== "admin") {
    router.push("/admin")
    return null
  }

  const handleSave = async () => {
    setSaving("menu")
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
      setSaving("")
    }
  }

  const handleClear = async () => {
    setSaving("menu")
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
      setSaving("")
    }
  }

  const handleSaveFeed = async () => {
    setSaving("feed")
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chave: "feed_ministerio_id", valor: feedMinisterioId }),
      })
      mutate()
      toast({ title: "Ministério do feed salvo" })
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setSaving("")
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
            <Button onClick={handleSave} disabled={!!saving || !menuMinisterioId}>
              {saving === "menu" ? "Salvando..." : "Salvar"}
            </Button>
            {menuMinisterioId && (
              <Button variant="outline" onClick={handleClear} disabled={!!saving}>
                Remover restrição
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feed de Postagens
          </CardTitle>
          <CardDescription>
            Selecione qual ministério pode criar postagens no feed da igreja.
            Membros desse ministério (e admins) poderão publicar no /feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ministério responsável pelo Feed</label>
            <Select value={feedMinisterioId} onValueChange={setFeedMinisterioId}>
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
          <Button onClick={handleSaveFeed} disabled={!!saving || !feedMinisterioId}>
            {saving === "feed" ? "Salvando..." : "Salvar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
