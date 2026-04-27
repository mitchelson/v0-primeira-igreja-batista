"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChevronDown } from "lucide-react"
import { EscalaActions } from "./escala-actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Colega {
  nome: string
  funcao?: string
}

interface EscalaCardProps {
  escala: {
    id: string
    titulo: string
    data: string
    horario?: string
    ministerio: string
    icone?: string
    funcao?: string
    status: string
  }
  colegas: Colega[]
}

export function EscalaCard({ escala, colegas }: EscalaCardProps) {
  const data = new Date(escala.data)
  const dia = data.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })
  const mes = data.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "")
  const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" }).replace(".", "")
  const isPendente = escala.status === "pendente"

  return (
    <div className={`rounded-xl border overflow-hidden ${isPendente ? "border-orange-300 bg-orange-50/50 ring-1 ring-orange-200" : "bg-card"}`}>
      <div className="flex items-stretch">
        {/* Date sidebar */}
        <div className={`flex flex-col items-center justify-center w-16 py-4 shrink-0 ${isPendente ? "bg-orange-100 text-orange-700" : "bg-primary/10 text-primary"}`}>
          <span className="text-2xl font-bold leading-none">{dia}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wide mt-1">{mes}</span>
          <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{diaSemana}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-3 gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm leading-tight">{escala.titulo}</p>
            {isPendente && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 text-[10px] shrink-0">
                Pendente
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {escala.horario && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{escala.horario}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="text-xl">{escala.icone || ""}</span>
                {escala.ministerio}
              </span>
              {escala.funcao && (
                <Badge variant="secondary" className="text-[11px] font-normal">{escala.funcao}</Badge>
              )}
            </div>
            <div className="shrink-0">
              <EscalaActions id={escala.id} status={escala.status} />
            </div>
          </div>

          {/* Colegas colapsável */}
          {colegas.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors border-t pt-1.5 w-full">
                <Users className="h-3 w-3" />
                <span>{colegas.length} colega{colegas.length > 1 ? "s" : ""} de escala</span>
                <ChevronDown className="h-3 w-3 ml-auto transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {colegas.map((c, i) => (
                    <span key={i} className="text-[11px] text-muted-foreground">
                      {c.nome}{c.funcao ? ` (${c.funcao})` : ""}{i < colegas.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  )
}
