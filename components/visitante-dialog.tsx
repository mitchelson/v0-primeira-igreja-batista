"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { formatarData, gerarMensagemWhatsApp } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { MessageSquare, Edit } from "lucide-react"
import type { Visitante, Responsavel } from "@/types/supabase"
import NovoVisitanteDialog from "./novo-visitante-dialog"

interface VisitanteDialogProps {
  visitante: Visitante & { responsavel_nome?: string | null }
  onClose: () => void
  onUpdate: (visitante: Visitante) => void
}

export default function VisitanteDialog({
  visitante,
  onClose,
  onUpdate,
}: VisitanteDialogProps) {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<
    string | null
  >(visitante.responsavel_id || null)
  const [nomeResponsavel, setNomeResponsavel] = useState<string>(
    visitante.responsavel_nome || "",
  )
  const [mensagemEnviada, setMensagemEnviada] = useState<boolean>(
    visitante.mensagem_enviada,
  )
  const [semWhatsapp, setSemWhatsapp] = useState<boolean>(
    visitante.sem_whatsapp || false,
  )
  const [salvando, setSalvando] = useState(false)
  const [carregandoResponsaveis, setCarregandoResponsaveis] = useState(true)
  const [editandoCadastro, setEditandoCadastro] = useState(false)

  useEffect(() => {
    const carregarResponsaveis = async () => {
      setCarregandoResponsaveis(true)
      try {
        const res = await fetch("/api/responsaveis")
        if (!res.ok) throw new Error("Erro ao carregar responsaveis")
        const data = await res.json()
        setResponsaveis(data)
      } catch (error) {
        console.error("Erro ao carregar responsaveis:", error)
      } finally {
        setCarregandoResponsaveis(false)
      }
    }

    carregarResponsaveis()
  }, [])

  useEffect(() => {
    if (responsavelSelecionado) {
      const resp = responsaveis.find((r) => r.id === responsavelSelecionado)
      if (resp) {
        setNomeResponsavel(resp.nome)
      }
    } else {
      setNomeResponsavel("")
    }
  }, [responsavelSelecionado, responsaveis])

  useEffect(() => {
    if (semWhatsapp) {
      setMensagemEnviada(true)
    }
  }, [semWhatsapp])

  const handleSalvar = async () => {
    setSalvando(true)
    try {
      const res = await fetch(`/api/visitantes/${visitante.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responsavel_id: responsavelSelecionado,
          mensagem_enviada: mensagemEnviada || semWhatsapp,
          sem_whatsapp: semWhatsapp,
        }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar visitante")

      const visitanteAtualizado: Visitante = {
        ...visitante,
        responsavel_id: responsavelSelecionado,
        mensagem_enviada: mensagemEnviada || semWhatsapp,
        sem_whatsapp: semWhatsapp,
      }

      onUpdate(visitanteAtualizado)
      toast({
        title: "Visitante atualizado",
        description: "As informacoes foram salvas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar visitante:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao atualizar o visitante.",
      })
    } finally {
      setSalvando(false)
    }
  }

  const handleEnviarWhatsApp = () => {
    const mensagem = gerarMensagemWhatsApp(visitante, nomeResponsavel)
    const telefone = visitante.celular.replace(/\D/g, "")
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, "_blank")
  }

  const handleEdicaoCadastro = (visitanteAtualizado: Visitante) => {
    onUpdate(visitanteAtualizado)
    setEditandoCadastro(false)
  }

  const cidadeDisplay =
    visitante.cidade === "Outra" && visitante.cidade_outra
      ? visitante.cidade_outra
      : visitante.cidade || "Nao informado"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[100vh] md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalhes do Visitante
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditandoCadastro(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar visitante</span>
            </Button>
          </DialogTitle>
          <DialogDescription>
            Cadastrado em {formatarData(visitante.data_cadastro)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nome</Label>
            <div className="col-span-3 font-medium">{visitante.nome}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Sexo</Label>
            <div className="col-span-3">
              {visitante.sexo || "Nao informado"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Celular</Label>
            <div className="col-span-3">{visitante.celular}</div>
          </div>
          {visitante.telefone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Telefone</Label>
              <div className="col-span-3">{visitante.telefone}</div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Cidade</Label>
            <div className="col-span-3">{cidadeDisplay}</div>
          </div>
          {visitante.bairro && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Bairro</Label>
              <div className="col-span-3">{visitante.bairro}</div>
            </div>
          )}
          {visitante.faixa_etaria && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Faixa Etaria</Label>
              <div className="col-span-3">{visitante.faixa_etaria}</div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Estado Civil</Label>
            <div className="col-span-3">
              {visitante.civil_status || "Nao informado"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Membro</Label>
            <div className="col-span-3">
              {visitante.membro_igreja ? "Sim" : "Nao"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Quer visita</Label>
            <div className="col-span-3">
              {visitante.quer_visita ? "Sim" : "Nao"}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsavel" className="text-right">
              Responsavel
            </Label>
            <div className="col-span-3">
              {carregandoResponsaveis ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    Carregando responsaveis...
                  </span>
                </div>
              ) : (
                <Select
                  value={responsavelSelecionado || "none"}
                  onValueChange={(value) =>
                    setResponsavelSelecionado(value === "none" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsavel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {responsaveis.length > 0 ? (
                      responsaveis.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        Nenhum responsavel cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sem-whatsapp" className="text-right">
              Sem WhatsApp
            </Label>
            <div className="flex items-center gap-2 col-span-3">
              <Switch
                id="sem-whatsapp"
                checked={semWhatsapp}
                onCheckedChange={(checked) => {
                  setSemWhatsapp(checked)
                  if (checked) {
                    setMensagemEnviada(true)
                  }
                }}
              />
              <Label htmlFor="sem-whatsapp">
                {semWhatsapp ? "Sim" : "Nao"}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mensagem-enviada" className="text-right">
              Mensagem enviada
            </Label>
            <div className="flex items-center gap-2 col-span-3">
              <Switch
                id="mensagem-enviada"
                checked={mensagemEnviada}
                onCheckedChange={setMensagemEnviada}
                disabled={semWhatsapp}
              />
              <Label htmlFor="mensagem-enviada">
                {mensagemEnviada ? "Sim" : "Nao"}
              </Label>
              {semWhatsapp && (
                <span className="text-xs text-muted-foreground">
                  (Automatico para visitantes sem WhatsApp)
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleEnviarWhatsApp}
            className="w-full sm:w-auto"
            disabled={!visitante.celular || semWhatsapp}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar WhatsApp
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              disabled={salvando}
              className="flex-1"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>

        {editandoCadastro && (
          <NovoVisitanteDialog
            visitanteParaEdicao={visitante}
            onClose={() => setEditandoCadastro(false)}
            onSave={handleEdicaoCadastro}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
