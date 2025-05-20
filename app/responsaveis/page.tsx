"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "@/components/login-form"
import { supabase } from "@/lib/supabase"
import type { Responsavel } from "@/types/supabase"

export default function ResponsaveisPage() {
  const { isAuthenticated } = useAuth()
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [novoResponsavel, setNovoResponsavel] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [responsavelParaExcluir, setResponsavelParaExcluir] = useState<Responsavel | null>(null)

  // Carregar responsáveis apenas se estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      carregarResponsaveis()
    }
  }, [isAuthenticated])

  const carregarResponsaveis = async () => {
    setCarregando(true)
    try {
      const { data, error } = await supabase.from("responsaveis").select("*").order("nome")

      if (error) throw error
      if (data) setResponsaveis(data)
    } catch (error) {
      console.error("Erro ao carregar responsáveis:", error)
    } finally {
      setCarregando(false)
    }
  }

  // Se não estiver autenticado, exibe o formulário de login
  if (!isAuthenticated) {
    return <LoginForm />
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!novoResponsavel.trim()) {
      toast({
        variant: "destructive",
        title: "Nome inválido",
        description: "Por favor, digite um nome válido.",
      })
      return
    }

    setSalvando(true)
    try {
      const { data, error } = await supabase.from("responsaveis").insert({ nome: novoResponsavel }).select()

      if (error) throw error

      if (data && data[0]) {
        setResponsaveis((prev) => [...prev, data[0]])
        setNovoResponsavel("")
        toast({
          title: "Responsável adicionado",
          description: "O responsável foi adicionado com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar responsável:", error)
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o responsável.",
      })
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    if (!responsavelParaExcluir) return

    try {
      const { error } = await supabase.from("responsaveis").delete().eq("id", responsavelParaExcluir.id)

      if (error) throw error

      setResponsaveis((prev) => prev.filter((r) => r.id !== responsavelParaExcluir.id))
      toast({
        title: "Responsável removido",
        description: "O responsável foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover responsável:", error)
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o responsável.",
      })
    } finally {
      setResponsavelParaExcluir(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Responsáveis</CardTitle>
          <CardDescription>Adicione ou remova responsáveis pelo envio de mensagens aos visitantes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvar} className="flex gap-2 mb-6">
            <Input
              placeholder="Nome do responsável"
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : responsaveis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum responsável cadastrado.</div>
          ) : (
            <div className="space-y-2">
              {responsaveis.map((responsavel) => (
                <div key={responsavel.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{responsavel.nome}</span>
                  <Button variant="ghost" size="icon" onClick={() => setResponsavelParaExcluir(responsavel)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!responsavelParaExcluir} onOpenChange={() => setResponsavelParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o responsável "{responsavelParaExcluir?.nome}"? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
