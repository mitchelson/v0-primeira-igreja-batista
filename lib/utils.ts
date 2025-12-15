import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SexoType, IntencaoType } from "@/types/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constantes para formatação
const TELEFONE_REGEX = /\D/g
const MAX_TELEFONE_LENGTH = 11

export function formatarTelefone(telefone: string): string {
  // Remove caracteres não numéricos
  const numeros = telefone.replace(TELEFONE_REGEX, "")

  // Limita o número de dígitos
  const numerosLimitados = numeros.slice(0, MAX_TELEFONE_LENGTH)

  // Formata o número de telefone
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
    return "Data inválida"
  }
}

// Interface para os dados do visitante na geração de mensagem
interface VisitanteParaMensagem {
  readonly nome: string
  readonly data_cadastro: string
  readonly intencao: IntencaoType
  readonly sexo?: SexoType | null
}

// Função para obter pronome baseado no sexo
function obterPronome(sexo: SexoType | null | undefined): 'o' | 'a' {
  return sexo === "Feminino" ? "a" : "o"
}

// Função para gerar mensagem baseada na intenção
function gerarMensagemPorIntencao(
  intencao: IntencaoType,
  nome: string,
  pronome: 'o' | 'a',
  nomeResp: string
): string {
  const mensagemBase = `Graça e Paz, ${nome}, tudo bem? 
Sou ${nomeResp} da Primeira Igreja Batista de Roraima.
Ficamos muito felizes e honrados em ter você compartilhando no culto conosco, sinta-se abraçad${pronome} e seja sempre bem-vind${pronome}!!`
  // mensagem de recesso 
  return `${mensagemBase}
Desejamos a você e sua família um abençoado Ano Novo, repleto de paz, saúde e realizações.
Agradecemos sua presença conosco e esperamos revê-lo em nossos próximos encontros após o recesso.

Que Deus continue guiando seus passos e abençoando sua vida.
Grande abraço!`

  switch (intencao) {
    case "Quero ser membro":
      return `${mensagemBase}
Estaremos enviando a programação semanal de nossa igreja. Sinta-se convidado para participar e qualquer coisa estou a disposição.
Orientamos fazer o agendamento na capelania com o Pr. Marcelo para que possamos conhecê-lo e para que você nos conheça melhor. O contato para agendar é +55 95 9152-2392 , falar com Manuela.
Permaneça. Amamos sua vida. 
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`

    case "Sou membro de outra igreja":
      return `${mensagemBase}
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`

    case "Gostaria de conhecer melhor":
      return `${mensagemBase}
Estaremos enviando a programação semanal de nossa igreja. Sinta-se convidado para participar e qualquer coisa estou a disposição.
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`

    default:
      return `Olá ${nome}, tudo bem? Sou ${nomeResp} da Primeira Igreja Batista de Roraima. 
Agradecemos sua visita e cadastro em nossa igreja. 
Estamos à disposição para qualquer dúvida ou necessidade. Deus abençoe!`
  }
}

export function gerarMensagemWhatsApp(
  visitante: VisitanteParaMensagem,
  nomeResponsavel?: string,
): string {
  const pronome = obterPronome(visitante.sexo)
  const nomeResp = nomeResponsavel ?? "um responsável"

  const mensagem = gerarMensagemPorIntencao(
    visitante.intencao,
    visitante.nome,
    pronome,
    nomeResp
  )

  return encodeURIComponent(mensagem)
}

// Função utilitária para validar telefone
export function validarTelefone(telefone: string): boolean {
  const numeros = telefone.replace(TELEFONE_REGEX, "")
  return numeros.length >= 10 && numeros.length <= 11
}

// Função para limpar e validar dados de entrada
export function sanitizarString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}
