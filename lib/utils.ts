import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SexoType } from "@/types/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constantes para formatacao
const TELEFONE_REGEX = /\D/g
const MAX_TELEFONE_LENGTH = 11

export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(TELEFONE_REGEX, "")
  const numerosLimitados = numeros.slice(0, MAX_TELEFONE_LENGTH)

  if (numerosLimitados.length <= 2) {
    return numerosLimitados
  } else if (numerosLimitados.length <= 6) {
    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2)}`
  } else if (numerosLimitados.length <= 10) {
    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 6)}-${numerosLimitados.slice(6)}`
  } else {
    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 7)}-${numerosLimitados.slice(7, 11)}`
  }
}

export function formatarData(data: string): string {
  try {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return "Data invalida"
  }
}

// Interface para os dados do visitante na geracao de mensagem
interface VisitanteParaMensagem {
  readonly nome: string
  readonly data_cadastro: string
  readonly sexo?: SexoType | null
  readonly membro_igreja?: boolean
  readonly quer_visita?: boolean
}

function obterPronome(sexo: SexoType | null | undefined): "o" | "a" {
  return sexo === "Feminino" ? "a" : "o"
}

export function gerarMensagemWhatsApp(
  visitante: VisitanteParaMensagem,
  nomeResponsavel?: string,
): string {
  const pronome = obterPronome(visitante.sexo)
  const nomeResp = nomeResponsavel ?? "um responsavel"

  const mensagem = `Graca e Paz, ${visitante.nome}, tudo bem?
Sou ${nomeResp} da Primeira Igreja Batista de Roraima.
Ficamos muito felizes e honrados em ter voce compartilhando no culto conosco, sinta-se abracad${pronome} e seja sempre bem-vind${pronome}!!
Tenha uma semana abencoada e cheia da presenca de Jesus!
Grande abraco!`

  return encodeURIComponent(mensagem)
}

export function validarTelefone(telefone: string): boolean {
  const numeros = telefone.replace(TELEFONE_REGEX, "")
  return numeros.length >= 10 && numeros.length <= 11
}

export function sanitizarString(input: string): string {
  return input.trim().replace(/\s+/g, " ")
}
