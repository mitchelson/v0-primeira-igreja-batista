import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarTelefone(telefone: string): string {
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, "")

  // Formata o número de telefone
  if (numeros.length <= 2) {
    return numeros
  } else if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  } else if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  } else {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`
  }
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function gerarMensagemWhatsApp(
  visitante: {
    nome: string
    data_cadastro: string
    intencao: string
    sexo?: string | null
  },
  nomeResponsavel?: string,
): string {
  const pronome = visitante.sexo === "Feminino" ? "a" : "o"
  const nomeResp = nomeResponsavel || "um responsável"

  let mensagem = ""

  switch (visitante.intencao) {
    case "Quero ser membro":
      mensagem = `Graça e Paz, ${visitante.nome}, tudo bem? 
Sou ${nomeResp} da Primeira Igreja Batista de Roraima.
Ficamos muito felizes e honrados em ter você compartilhando no culto conosco, sinta-se abraçad${pronome} e seja sempre bem-vind${pronome}!!
Estaremos enviando a programação semanal de nossa igreja. Sinta-se convidado para participar e qualquer coisa estou a disposição.
Orientamos fazer o agendamento na capelania com o Pr. Marcelo para que possamos conhecê-lo e para que você nos conheça melhor. O contato para agendar é +55 95 9152-2392 , falar com Manuela.
Permaneça. Amamos sua vida. 
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`
      break

    case "Sou membro de outra igreja":
      mensagem = `Graça e Paz, ${visitante.nome}, tudo bem? 
Sou ${nomeResp} da Primeira Igreja Batista de Roraima.
Ficamos muito felizes e honrados em ter você compartilhando no culto conosco, sinta-se abraçad${pronome} e seja sempre bem-vind${pronome}!!
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`
      break

    case "Gostaria de conhecer melhor":
      mensagem = `Graça e Paz, ${visitante.nome}, tudo bem? 
Sou ${nomeResp} da Primeira Igreja Batista de Roraima.
Ficamos muito felizes e honrados em ter você compartilhando no culto conosco, sinta-se abraçad${pronome} e seja sempre bem-vind${pronome}!!
Estaremos enviando a programação semanal de nossa igreja. Sinta-se convidado para participar e qualquer coisa estou a disposição.
Tenha uma semana abençoada e cheia da presença de Jesus!
Grande abraço!`
      break

    default:
      mensagem = `Olá ${visitante.nome}, tudo bem? Sou ${nomeResp} da Primeira Igreja Batista de Roraima. 
Agradecemos sua visita e cadastro em nossa igreja. 
Estamos à disposição para qualquer dúvida ou necessidade. Deus abençoe!`
  }

  return encodeURIComponent(mensagem)
}
