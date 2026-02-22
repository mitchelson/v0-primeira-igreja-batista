import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

// Dynamic message template processor
// Replaces placeholders like [Nome], [Seu Nome], [Nome da Igreja], [horario], [data]
interface VisitanteParaMensagem {
  readonly nome: string
  readonly data_cadastro: string
  readonly sexo?: string | null
  readonly membro_igreja?: boolean
  readonly quer_visita?: boolean
}

export function processarTemplateMensagem(
  template: string,
  visitante: VisitanteParaMensagem,
  nomeResponsavel?: string,
): string {
  const pronome = visitante.sexo === "Feminino" ? "a" : "o"
  const pronomeMaiusculo = visitante.sexo === "Feminino" ? "A" : "O"

  let resultado = template
    .replace(/\[Nome\]/g, visitante.nome)
    .replace(/\[nome\]/g, visitante.nome)
    .replace(/\[Seu Nome\]/g, nomeResponsavel ?? "um responsavel")
    .replace(/\[seu nome\]/g, nomeResponsavel ?? "um responsavel")
    .replace(/\[Nome da Igreja\]/g, "Primeira Igreja Batista de Roraima")
    .replace(/\[nome da igreja\]/g, "Primeira Igreja Batista de Roraima")
    .replace(/\[horario\]/g, "19h")
    .replace(/\[Horario\]/g, "19h")
    .replace(/\[data\]/g, formatarData(visitante.data_cadastro))
    .replace(/\[Data\]/g, formatarData(visitante.data_cadastro))
    .replace(/\[pronome\]/g, pronome)
    .replace(/\[Pronome\]/g, pronomeMaiusculo)
    .replace(/\[bem-vindo\]/g, `bem-vind${pronome}`)
    .replace(/\[Bem-vindo\]/g, `Bem-vind${pronome}`)
    .replace(/\[abracado\]/g, `abracad${pronome}`)
    .replace(/\[Abracado\]/g, `Abracad${pronome}`)
    .replace(/\[convidado\]/g, `convidad${pronome}`)
    .replace(/\[Convidado\]/g, `Convidad${pronome}`)

  return resultado
}

export function gerarLinkWhatsApp(
  celular: string,
  mensagemProcessada: string,
): string {
  const numeros = celular.replace(TELEFONE_REGEX, "")
  const numeroComCodigo = numeros.startsWith("55") ? numeros : `55${numeros}`
  return `https://wa.me/${numeroComCodigo}?text=${encodeURIComponent(mensagemProcessada)}`
}

export function validarTelefone(telefone: string): boolean {
  const numeros = telefone.replace(TELEFONE_REGEX, "")
  return numeros.length >= 10 && numeros.length <= 11
}

export function sanitizarString(input: string): string {
  return input.trim().replace(/\s+/g, " ")
}
