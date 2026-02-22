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
import { Separator } from "@/components/ui/separator"
import { formatarData, gerarMensagemSegunda, gerarMensagemSabado } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { MessageSquare, Edit, Phone } from "lucide-react"
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
  const [msgSegunda, setMsgSegunda] = useState<boolean>(
    visitante.msg_segunda,
  )
  const [msgSabado, setMsgSabado] = useState<boolean>(
    visitante.msg_sabado,
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
      setMsgSegunda(true)
      setMsgSabado(true)
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
          msg_segunda: msgSegunda || semWhatsapp,
          msg_sabado: msgSabado || semWhatsapp,
          sem_whatsapp: semWhatsapp,
        }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar visitante")

      const visitanteAtualizado: Visitante = {
        ...visitante,
        responsavel_id: responsavelSelecionado,
        msg_segunda: msgSegunda || semWhatsapp,
        msg_sabado: msgSabado || semWhatsapp,
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

  const handleEnviarSegunda = () => {
    const mensagem = gerarMensagemSegunda(visitante, nomeResponsavel)
    const telefone = visitante.celular.replace(/\D/g, "")
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, "_blank")
  }

  const handleEnviarSabado = () => {
    const mensagem = gerarMensagemSabado(visitante, nomeResponsavel)
    const telefone = visitante.celular.replace(/\D/g, "")
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, "_blank")
  }

  const handleEdicaoCadastro = (visitanteAtualizado: Visitante) => {
    onUpdate(visitanteAtualizado)
    setEditandoCadastro(false)
  }

  // Build summary text
  const cidadeDisplay =
    visitante.cidade === "Outra" && visitante.cidade_outra
      ? visitante.cidade_outra
      : visitante.cidade || "cidade nao informada"

  const membroText = visitante.membro_igreja
    ? "e membro de igreja"
    : "nao e membro de igreja"

  const visitaText = visitante.quer_visita
    ? "deseja receber visita"
    : "nao deseja receber visita"

  const resumo = [
    visitante.nome,
    visitante.faixa_etaria,
    visitante.civil_status ? `${visitante.civil_status}(a)` : null,
    `mora em ${cidadeDisplay}`,
    membroText,
    visitaText,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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

        <div className="space-y-4">
          {/* Resumo compacto */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm leading-relaxed">
              {resumo}
              {"."}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-medium">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{visitante.celular}</span>
            </div>
          </div>

          <Separator />

          {/* Responsavel */}
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsavel</Label>
            {carregandoResponsaveis ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full" />
                <span className="text-sm text-muted-foreground">
                  Carregando...
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

          {/* Sem WhatsApp */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sem-whatsapp">Sem WhatsApp</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="sem-whatsapp"
                checked={semWhatsapp}
                onCheckedChange={(checked) => {
                  setSemWhatsapp(checked)
                  if (checked) {
                    setMsgSegunda(true)
                    setMsgSabado(true)
                  }
                }}
              />
              <span className="text-sm text-muted-foreground w-8">
                {semWhatsapp ? "Sim" : "Nao"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Mensagem de Segunda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Msg Segunda (agradecimento)</p>
                <p className="text-xs text-muted-foreground">
                  Enviada na segunda para agradecer a visita
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="msg-segunda"
                  checked={msgSegunda}
                  onCheckedChange={setMsgSegunda}
                  disabled={semWhatsapp}
                />
                <span className="text-sm text-muted-foreground w-8">
                  {msgSegunda ? "Sim" : "Nao"}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnviarSegunda}
              className="w-full"
              disabled={!visitante.celular || semWhatsapp}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar agradecimento (segunda)
            </Button>
          </div>

          <Separator />

          {/* Mensagem de Sabado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Msg Sabado (convite)</p>
                <p className="text-xs text-muted-foreground">
                  Enviada no sabado convidando para o culto
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="msg-sabado"
                  checked={msgSabado}
                  onCheckedChange={setMsgSabado}
                  disabled={semWhatsapp}
                />
                <span className="text-sm text-muted-foreground w-8">
                  {msgSabado ? "Sim" : "Nao"}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnviarSabado}
              className="w-full"
              disabled={!visitante.celular || semWhatsapp}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar convite (sabado)
            </Button>
          </div>

          {semWhatsapp && (
            <p className="text-xs text-muted-foreground text-center">
              Mensagens marcadas automaticamente para visitantes sem WhatsApp
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
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
