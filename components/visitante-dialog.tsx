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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { formatarData, gerarMensagemWhatsApp } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { MessageSquare } from "lucide-react"
import type { Visitante, Responsavel } from "@/types/supabase"

interface VisitanteDialogProps {
  visitante: Visitante & { responsavel_nome?: string | null }
  onClose: () => void
  onUpdate: (visitante: Visitante) => void
}

export default function VisitanteDialog({ visitante, onClose, onUpdate }: VisitanteDialogProps) {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<string | null>(visitante.responsavel_id || null)
  const [nomeResponsavel, setNomeResponsavel] = useState<string>(visitante.responsavel_nome || "")
  const [mensagemEnviada, setMensagemEnviada] = useState<boolean>(visitante.mensagem_enviada)
  const [semWhatsapp, setSemWhatsapp] = useState<boolean>(visitante.sem_whatsapp || false)
  const [salvando, setSalvando] = useState(false)
  const [carregandoResponsaveis, setCarregandoResponsaveis] = useState(true)

  useEffect(() => {
    const carregarResponsaveis = async () => {
      setCarregandoResponsaveis(true)
      try {
        console.log("Carregando responsáveis...")
        const { data, error } = await supabase.from("responsaveis").select("*").order("nome")

        if (error) {
          console.error("Erro ao carregar responsáveis:", error)
          throw error
        }

        console.log("Responsáveis carregados:", data)
        if (data) setResponsaveis(data)
      } catch (error) {
        console.error("Erro ao carregar responsáveis:", error)
      } finally {
        setCarregandoResponsaveis(false)
      }
    }

    carregarResponsaveis()
  }, [])

  // Atualizar o nome do responsável quando o responsável selecionado mudar
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

  // Atualizar o estado de mensagem enviada quando o checkbox "sem WhatsApp" for marcado
  useEffect(() => {
    if (semWhatsapp) {
      setMensagemEnviada(true) // Se não tem WhatsApp, considera a mensagem como enviada
    }
  }, [semWhatsapp])

  const handleSalvar = async () => {
    setSalvando(true)
    try {
      const { error } = await supabase
        .from("visitantes")
        .update({
          responsavel_id: responsavelSelecionado,
          mensagem_enviada: mensagemEnviada || semWhatsapp, // Se não tem WhatsApp, considera a mensagem como enviada
          sem_whatsapp: semWhatsapp,
        })
        .eq("id", visitante.id)

      if (error) throw error

      // Atualizar o objeto visitante com os novos valores
      const visitanteAtualizado: Visitante = {
        ...visitante,
        responsavel_id: responsavelSelecionado,
        mensagem_enviada: mensagemEnviada || semWhatsapp,
        sem_whatsapp: semWhatsapp,
      }

      onUpdate(visitanteAtualizado)
      toast({
        title: "Visitante atualizado",
        description: "As informações foram salvas com sucesso.",
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Visitante</DialogTitle>
          <DialogDescription>Cadastrado em {formatarData(visitante.data_cadastro)}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nome</Label>
            <div className="col-span-3 font-medium">{visitante.nome}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Sexo</Label>
            <div className="col-span-3">{visitante.sexo || "Não informado"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Celular</Label>
            <div className="col-span-3">{visitante.celular}</div>
          </div>

          {visitante.cidade && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cidade</Label>
              <div className="col-span-3">{visitante.cidade}</div>
            </div>
          )}

          {visitante.bairro && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Bairro</Label>
              <div className="col-span-3">{visitante.bairro}</div>
            </div>
          )}

          {visitante.idade && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Idade</Label>
              <div className="col-span-3">{visitante.idade} anos</div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Intenção</Label>
            <div className="col-span-3">{visitante.intencao}</div>
          </div>

          {visitante.pedidos_oracao && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Pedidos de oração</Label>
              <div className="col-span-3 bg-muted p-2 rounded-md">{visitante.pedidos_oracao}</div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsavel" className="text-right">
              Responsável
            </Label>
            <div className="col-span-3">
              {carregandoResponsaveis ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Carregando responsáveis...</span>
                </div>
              ) : (
                <Select
                  value={responsavelSelecionado || "none"}
                  onValueChange={(value) => setResponsavelSelecionado(value === "none" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
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
                        Nenhum responsável cadastrado
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
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="sem-whatsapp"
                checked={semWhatsapp}
                onCheckedChange={(checked) => {
                  setSemWhatsapp(checked)
                  if (checked) {
                    setMensagemEnviada(true) // Se não tem WhatsApp, considera a mensagem como enviada
                  }
                }}
              />
              <Label htmlFor="sem-whatsapp">{semWhatsapp ? "Sim" : "Não"}</Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mensagem-enviada" className="text-right">
              Mensagem enviada
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="mensagem-enviada"
                checked={mensagemEnviada}
                onCheckedChange={setMensagemEnviada}
                disabled={semWhatsapp} // Desabilita se não tem WhatsApp
              />
              <Label htmlFor="mensagem-enviada">{mensagemEnviada ? "Sim" : "Não"}</Label>
              {semWhatsapp && (
                <span className="text-xs text-muted-foreground">(Automático para visitantes sem WhatsApp)</span>
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
            <Button onClick={handleSalvar} disabled={salvando} className="flex-1">
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
