import localforage from "localforage"

// Configuração do localforage
localforage.config({
  name: "pib-roraima",
  storeName: "visitantes",
})

// Tipos
export interface Visitante {
  id: string
  nome: string
  celular: string
  cidade: string
  bairro: string
  idade: string
  pedidosOracao: string
  intencao: "membro_outra" | "conhecer" | "ser_membro"
  dataCadastro: string
  mensagemEnviada: boolean
  responsavel?: string
}

export interface Responsavel {
  id: string
  nome: string
}

// Funções para gerenciar visitantes
export async function salvarVisitante(
  visitante: Omit<Visitante, "id" | "dataCadastro" | "mensagemEnviada">,
): Promise<Visitante> {
  const novoVisitante: Visitante = {
    ...visitante,
    id: crypto.randomUUID(),
    dataCadastro: new Date().toISOString(),
    mensagemEnviada: false,
  }

  try {
    // Buscar visitantes existentes
    const visitantes = await obterVisitantes()

    // Adicionar novo visitante
    visitantes.push(novoVisitante)

    // Salvar lista atualizada
    await localforage.setItem("visitantes", visitantes)

    return novoVisitante
  } catch (error) {
    console.error("Erro ao salvar visitante:", error)
    throw new Error("Não foi possível salvar o visitante")
  }
}

export async function obterVisitantes(): Promise<Visitante[]> {
  try {
    const visitantes = await localforage.getItem<Visitante[]>("visitantes")
    return visitantes || []
  } catch (error) {
    console.error("Erro ao obter visitantes:", error)
    return []
  }
}

export async function atualizarVisitante(visitante: Visitante): Promise<void> {
  try {
    const visitantes = await obterVisitantes()
    const index = visitantes.findIndex((v) => v.id === visitante.id)

    if (index !== -1) {
      visitantes[index] = visitante
      await localforage.setItem("visitantes", visitantes)
    }
  } catch (error) {
    console.error("Erro ao atualizar visitante:", error)
    throw new Error("Não foi possível atualizar o visitante")
  }
}

// Funções para gerenciar responsáveis
export async function salvarResponsavel(nome: string): Promise<Responsavel> {
  const novoResponsavel: Responsavel = {
    id: crypto.randomUUID(),
    nome,
  }

  try {
    const responsaveis = await obterResponsaveis() 
    responsaveis.push(novoResponsavel)
    await localforage.setItem("responsaveis", responsaveis)
    return novoResponsavel
  } catch (error) {
    console.error("Erro ao salvar responsável:", error)
    throw new Error("Não foi possível salvar o responsável")
  }
}

export async function obterResponsaveis(): Promise<Responsavel[]> {
  try {
    const responsaveis = await localforage.getItem<Responsavel[]>("responsaveis")
    return responsaveis || []
  } catch (error) {
    console.error("Erro ao obter responsáveis:", error)
    return []
  }
}

export async function removerResponsavel(id: string): Promise<void> {
  try {
    const responsaveis = await obterResponsaveis()
    const novosResponsaveis = responsaveis.filter((r) => r.id !== id)
    await localforage.setItem("responsaveis", novosResponsaveis)
  } catch (error) {
    console.error("Erro ao remover responsável:", error)
    throw new Error("Não foi possível remover o responsável")
  }
}
