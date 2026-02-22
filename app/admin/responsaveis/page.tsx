"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Responsavel } from "@/types/supabase"

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [novoResponsavel, setNovoResponsavel] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [responsavelParaExcluir, setResponsavelParaExcluir] =
    useState<Responsavel | null>(null)

  useEffect(() => {
    carregarResponsaveis()
  }, [])

  const carregarResponsaveis = async () => {
    setCarregando(true)
    try {
      const res = await fetch("/api/responsaveis")
      if (!res.ok) throw new Error("Erro ao carregar responsaveis")
      const data = await res.json()
      setResponsaveis(data)
    } catch (error) {
      console.error("Erro ao carregar responsaveis:", error)
    } finally {
      setCarregando(false)
    }
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!novoResponsavel.trim()) {
      toast({
        variant: "destructive",
        title: "Nome invalido",
        description: "Por favor, digite um nome valido.",
      })
      return
    }

    setSalvando(true)
    try {
      const res = await fetch("/api/responsaveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoResponsavel }),
      })

      if (!res.ok) throw new Error("Erro ao adicionar responsavel")

      const data = await res.json()
      setResponsaveis((prev) => [...prev, data])
      setNovoResponsavel("")
      toast({
        title: "Responsavel adicionado",
        description: "O responsavel foi adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar responsavel:", error)
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o responsavel.",
      })
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    if (!responsavelParaExcluir) return

    try {
      const res = await fetch(
        `/api/responsaveis/${responsavelParaExcluir.id}`,
        { method: "DELETE" },
      )

      if (!res.ok) throw new Error("Erro ao remover responsavel")

      setResponsaveis((prev) =>
        prev.filter((r) => r.id !== responsavelParaExcluir.id),
      )
      toast({
        title: "Responsavel removido",
        description: "O responsavel foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover responsavel:", error)
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o responsavel.",
      })
    } finally {
      setResponsavelParaExcluir(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Responsaveis</CardTitle>
          <CardDescription>
            Adicione ou remova responsaveis pelo envio de mensagens aos
            visitantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvar} className="flex gap-2 mb-6">
            <Input
              placeholder="Nome do responsavel"
              value={novoResponsavel}
              onChange={(e) => setNovoResponsavel(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={salvando}>
              {salvando ? "Adicionando..." : "Adicionar"}
            </Button>
          </form>

          {carregando ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : responsaveis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum responsavel cadastrado.
            </div>
          ) : (
            <div className="space-y-2">
              {responsaveis.map((responsavel) => (
                <div
                  key={responsavel.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span>{responsavel.nome}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setResponsavelParaExcluir(responsavel)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!responsavelParaExcluir}
        onOpenChange={() => setResponsavelParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o responsavel &quot;
              {responsavelParaExcluir?.nome}&quot;? Esta acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
