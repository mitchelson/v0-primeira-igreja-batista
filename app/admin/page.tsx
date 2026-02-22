"use client"

import { useEffect, useState } from "react"
import { useVisitantes } from "@/hooks/use-visitantes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatarData } from "@/lib/utils"
import {
  Search,
  Plus,
  User,
  AlertCircle,
  FileText,
  Users,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import VisitanteDialog from "@/components/visitante-dialog"
import NovoVisitanteDialog from "@/components/novo-visitante-dialog"
import RelatorioMensalDialog from "@/components/relatorio-mensal-dialog"
import type { Visitante, VisitanteComResponsavel } from "@/types/supabase"

export default function AdminPage() {
  const { visitantes, isLoading, criar, atualizar, deletar, mutate } =
    useVisitantes()
  const [visitantesFiltrados, setVisitantesFiltrados] = useState<
    VisitanteComResponsavel[]
  >([])
  const [termoBusca, setTermoBusca] = useState("")
  const [visitanteSelecionado, setVisitanteSelecionado] =
    useState<VisitanteComResponsavel | null>(null)
  const [novoVisitanteDialogAberto, setNovoVisitanteDialogAberto] =
    useState(false)
  const [relatorioDialogAberto, setRelatorioDialogAberto] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState<string>("")
  const [datasAgrupadas, setDatasAgrupadas] = useState<string[]>([])
  const [visitantesPorData, setVisitantesPorData] = useState<
    Record<string, VisitanteComResponsavel[]>
  >({})

  useEffect(() => {
    if (!isLoading) {
      setVisitantesFiltrados(visitantes)
      agruparPorData(visitantes)
    }
  }, [visitantes, isLoading])

  const agruparPorData = (lista: VisitanteComResponsavel[]) => {
    const grupos: Record<string, VisitanteComResponsavel[]> = {}
    lista.forEach((visitante) => {
      const dataFormatada = formatarData(visitante.data_cadastro)
      if (!grupos[dataFormatada]) {
        grupos[dataFormatada] = []
      }
      grupos[dataFormatada].push(visitante)
    })

    setVisitantesPorData(grupos)
    setDatasAgrupadas(
      Object.keys(grupos).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split("/").map(Number)
        const [diaB, mesB, anoB] = b.split("/").map(Number)
        if (anoA && anoB && mesA && mesB && diaA && diaB)
          return (
            new Date(anoB, mesB - 1, diaB).getTime() -
            new Date(anoA, mesA - 1, diaA).getTime()
          )
        return 0
      }),
    )
  }

  const carregarVisitantes = async () => {
    try {
      await mutate()
    } catch (error) {
      console.error("Erro ao carregar visitantes:", error)
    }
  }

  useEffect(() => {
    if (termoBusca.trim() === "") {
      setVisitantesFiltrados(visitantes)
      agruparPorData(visitantes)
    } else {
      const termo = termoBusca.toLowerCase()
      const filtrados = visitantes.filter(
        (v) =>
          v.nome.toLowerCase().includes(termo) ||
          v.celular.includes(termo) ||
          v.responsavel_nome?.toLowerCase().includes(termo),
      )
      setVisitantesFiltrados(filtrados)
      agruparPorData(filtrados)
    }
  }, [termoBusca, visitantes])

  const handleVisitanteAtualizado = (visitanteAtualizado: Visitante) => {
    setVisitantes((prev) =>
      prev.map((v) =>
        v.id === visitanteAtualizado.id
          ? {
              ...visitanteAtualizado,
              responsavel_nome:
                v.responsavel_nome !== undefined ? v.responsavel_nome : null,
            }
          : v,
      ),
    )
    setVisitanteSelecionado(null)
    carregarVisitantes()
  }

  const handleNovoVisitante = () => {
    carregarVisitantes()
    setNovoVisitanteDialogAberto(false)
  }

  const renderMensagemStatus = (visitante: VisitanteComResponsavel) => {
    if (visitante.sem_whatsapp) {
      return (
        <div className="flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Sem WhatsApp</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Administracao de Visitantes</CardTitle>
                <CardDescription>
                  Gerencie os visitantes cadastrados
                </CardDescription>
              </div>
              <Button
                onClick={() => setRelatorioDialogAberto(true)}
                variant="outline"
                size="sm"
              >
                <FileText className="mr-2 h-4 w-4" /> Relatorio
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/responsaveis">
                  <Users className="mr-2 h-4 w-4" /> Responsaveis
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/mensagens">
                  <MessageSquare className="mr-2 h-4 w-4" /> Mensagens
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou responsavel"
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : visitantesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {termoBusca
                ? "Nenhum visitante encontrado para esta busca."
                : "Nenhum visitante cadastrado."}
            </div>
          ) : (
            <div className="space-y-4">
              {datasAgrupadas.length > 1 && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="select-data"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Data:
                  </label>
                  <Select
                    value={dataSelecionada}
                    onValueChange={setDataSelecionada}
                  >
                    <SelectTrigger id="select-data" className="w-40">
                      <SelectValue placeholder="Selecione uma data" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasAgrupadas.map((data) => (
                        <SelectItem key={data} value={data}>
                          {data}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                {dataSelecionada &&
                  visitantesPorData[dataSelecionada]?.map((visitante) => (
                    <button
                      key={visitante.id}
                      className="flex flex-row w-full items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer gap-3"
                      onClick={() => setVisitanteSelecionado(visitante)}
                    >
                      <div className="flex flex-col text-left min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {visitante.nome}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-muted-foreground">
                          <span>{visitante.celular}</span>
                          {visitante.responsavel_nome && (
                            <div className="flex items-center text-emerald-600">
                              <User className="h-3 w-3 mr-0.5" />
                              <span>{visitante.responsavel_nome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {renderMensagemStatus(visitante) && (
                        <div className="flex-shrink-0">
                          {renderMensagemStatus(visitante)}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {visitanteSelecionado && (
        <VisitanteDialog
          visitante={visitanteSelecionado}
          onClose={() => setVisitanteSelecionado(null)}
          onUpdate={handleVisitanteAtualizado}
        />
      )}

      {novoVisitanteDialogAberto && (
        <NovoVisitanteDialog
          onClose={() => setNovoVisitanteDialogAberto(false)}
          onSave={handleNovoVisitante}
        />
      )}

      <RelatorioMensalDialog
        isOpen={relatorioDialogAberto}
        onClose={() => setRelatorioDialogAberto(false)}
        visitantes={visitantes}
      />

      {/* FAB - Novo Visitante */}
      <button
        onClick={() => setNovoVisitanteDialogAberto(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Novo Visitante"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}
