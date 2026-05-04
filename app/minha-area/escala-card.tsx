"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChevronDown, Music } from "lucide-react";
import { EscalaActions } from "./escala-actions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Colega {
  nome: string;
  foto_url?: string;
  funcao?: string;
  ministerio: string;
}

interface EscalaCardProps {
  evento: {
    id: string;
    titulo: string;
    data: string;
    horario?: string;
    observacoes?: string;
    is_escalado: boolean;
    escala_id?: string;
    minha_funcao?: string;
    meu_status?: string;
    minha_observacao?: string;
    ministerio?: string;
    icone?: string;
  };
  colegas: Colega[];
}

export function EscalaCard({ evento, colegas }: EscalaCardProps) {
  const data = new Date(evento.data);
  const dia = data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    timeZone: "UTC",
  });
  const mes = data
    .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  const diaSemana = data
    .toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" })
    .replace(".", "");
  const isPendente = evento.is_escalado && evento.meu_status === "pendente";
  const isEscalado = evento.is_escalado;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${isPendente ? "border-orange-300 bg-orange-50/50 ring-1 ring-orange-200" : isEscalado ? "bg-card" : "bg-muted/20"}`}
    >
      <div className="flex items-stretch">
        {/* Date sidebar */}
        <div
          className={`flex flex-col items-center justify-center w-16 py-4 shrink-0 ${isPendente ? "bg-orange-100 text-orange-700" : isEscalado ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
        >
          <span className="text-2xl font-bold leading-none">{dia}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wide mt-1">
            {mes}
          </span>
          <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
            {diaSemana}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-3 gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm leading-tight">
              {evento.titulo}
            </p>
            {isPendente && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 text-[10px] shrink-0">
                Pendente
              </Badge>
            )}
            {!isEscalado && (
              <Badge variant="outline" className="text-[10px] shrink-0">
                Não escalado
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {evento.horario && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {evento.horario}
                </span>
              )}
              {isEscalado && evento.ministerio && (
                <span className="flex items-center gap-1">
                  <span className="text-xl">{evento.icone || ""}</span>
                  {evento.ministerio}
                </span>
              )}
              {isEscalado && evento.minha_funcao && (
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {evento.minha_funcao}
                </Badge>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {colegas.length > 0 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                      <Users className="h-3 w-3" />
                      <span>
                        {colegas.length} colega{colegas.length > 1 ? "s" : ""}
                      </span>
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="max-h-[80vh] overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle>
                        Colegas de Escala - {evento.titulo}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      {evento.observacoes && (
                        <div className="rounded-lg border p-3 bg-muted/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">
                              Observações do Evento
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {evento.observacoes}
                          </p>
                        </div>
                      )}
                      <div className="space-y-3">
                        {colegas.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={c.foto_url} alt={c.nome} />
                              <AvatarFallback>
                                {c.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {c.nome}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {c.ministerio} - {c.funcao || "Sem função"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {isEscalado && evento.escala_id && (
                <EscalaActions
                  id={evento.escala_id}
                  status={evento.meu_status || ""}
                />
              )}
            </div>
          </div>

          {/* Observações da escala */}
          {isEscalado && evento.minha_observacao && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
              <strong>Obs:</strong> {evento.minha_observacao}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
