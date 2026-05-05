"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, ChevronDown } from "lucide-react";
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
import { RepertoireSection } from "./repertoire-section";

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
  userName?: string;
  isNext?: boolean;
}

function formatHorario(h: string) {
  return h.replace(/(\d{2}:\d{2})(:\d{2})/, "$1");
}

export function EscalaCard({
  evento,
  colegas,
  userName,
  isNext,
}: EscalaCardProps) {
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
  const horarioFormatado = evento.horario
    ? formatHorario(evento.horario)
    : null;

  const cardClass = isNext
    ? "border-blue-600 bg-blue-50/50"
    : isPendente
      ? "border-orange-300 bg-orange-50/50 ring-1 ring-orange-200"
      : "border-gray-200 bg-white";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={`w-full text-left rounded-2xl border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] ${cardClass}`}
        >
          <div className="flex items-center gap-3">
            {/* Date box */}
            <div
              className={`flex flex-col items-center justify-center rounded-xl p-2.5 min-w-[60px] ${
                isNext
                  ? "bg-blue-100 text-blue-700"
                  : isPendente
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-xl font-bold leading-none">{dia}</span>
              <span className="text-xs text-gray-500 uppercase font-semibold mt-0.5">
                {mes}
              </span>
              <span className="text-[10px] text-gray-400 capitalize">
                {diaSemana}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold text-gray-900 leading-tight">
                  {evento.titulo}
                </p>
                {isPendente && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 text-[10px] shrink-0 rounded-full px-2.5 py-0.5">
                    Pendente
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                {horarioFormatado && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {horarioFormatado}
                  </span>
                )}
                {isEscalado && evento.ministerio && (
                  <span className="flex items-center gap-1">
                    <span>{evento.icone || ""}</span>
                    {evento.ministerio}
                  </span>
                )}
              </div>

              {isEscalado && evento.minha_funcao && (
                <Badge className="bg-green-50 text-green-700 border-0 text-xs font-medium rounded-full px-2.5 py-0.5 w-fit">
                  {userName} - {evento.minha_funcao}
                </Badge>
              )}
              {!isEscalado && (
                <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] shrink-0 rounded-full px-2.5 py-0.5">
                  Não escalado
                </Badge>
              )}

              {isEscalado && evento.escala_id && (
                <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                  <EscalaActions
                    id={evento.escala_id}
                    status={evento.meu_status || ""}
                  />
                </div>
              )}
            </div>

            {/* Chevron */}
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Evento</SheetTitle>
          <p className="text-[13px] text-gray-500">
            {evento.titulo}
            {horarioFormatado ? ` • ${horarioFormatado}` : ""}
            {evento.observacoes ? ` • ${evento.observacoes}` : ""}
          </p>
        </SheetHeader>

        <RepertoireSection eventoId={evento.id} />

        <div className="border-t pt-4 mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Escalados</p>
          <div className="space-y-2">
            {Object.entries(
              colegas.reduce<Record<string, Colega[]>>((acc, c) => {
                (acc[c.ministerio] ||= []).push(c);
                return acc;
              }, {}),
            ).map(([ministerio, membros]) => (
              <Collapsible key={ministerio}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-900">{ministerio}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{membros.length}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform [[data-state=open]>&]:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2 pl-1">
                  {membros.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.foto_url} alt={c.nome} />
                        <AvatarFallback>{c.nome.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{c.nome}</p>
                        <p className="text-xs text-gray-400">{c.funcao || "Sem função"}</p>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
