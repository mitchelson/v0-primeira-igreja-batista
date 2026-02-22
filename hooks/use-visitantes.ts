import useSWR, { mutate } from "swr"
import { useState } from "react"
import type {
  Visitante,
  VisitanteInsert,
  VisitanteUpdate,
  VisitanteComResponsavel,
} from "@/types/supabase"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useVisitantes() {
  const { data: visitantes, isLoading, error } = useSWR<VisitanteComResponsavel[]>(
    "/api/visitantes",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const criar = async (
    visitanteData: VisitanteInsert,
  ): Promise<Visitante | null> => {
    try {
      const res = await fetch("/api/visitantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitanteData),
      })
      if (!res.ok) throw new Error("Erro ao criar visitante")
      const newVisitante = (await res.json()) as Visitante
      // Revalidate the list
      mutate("/api/visitantes")
      return newVisitante
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao criar visitante"
      throw new Error(errorMsg)
    }
  }

  const atualizar = async (
    id: string,
    visitanteData: VisitanteUpdate,
  ): Promise<Visitante | null> => {
    try {
      const res = await fetch(`/api/visitantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitanteData),
      })
      if (!res.ok) throw new Error("Erro ao atualizar visitante")
      const updated = (await res.json()) as Visitante
      // Revalidate the list
      mutate("/api/visitantes")
      return updated
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao atualizar visitante"
      throw new Error(errorMsg)
    }
  }

  const deletar = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/visitantes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao deletar visitante")
      // Revalidate the list
      mutate("/api/visitantes")
      return true
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao deletar visitante"
      throw new Error(errorMsg)
    }
  }

  return {
    visitantes: visitantes || [],
    isLoading,
    error: error ? error.message : null,
    criar,
    atualizar,
    deletar,
    mutate: () => mutate("/api/visitantes"),
  }
}

// Hook para filtros e busca
export function useFiltrosVisitantes(
  visitantes: VisitanteComResponsavel[],
) {
  const [termoBusca, setTermoBusca] = useState("")
  const [filtroFaixaEtaria, setFiltroFaixaEtaria] = useState<string>("")
  const [filtroSexo, setFiltroSexo] = useState<string>("")

  const visitantesFiltrados = visitantes.filter((visitante) => {
    const matchBusca =
      termoBusca === "" ||
      visitante.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      visitante.celular.includes(termoBusca) ||
      visitante.cidade?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      visitante.bairro?.toLowerCase().includes(termoBusca.toLowerCase())

    const matchFaixaEtaria =
      filtroFaixaEtaria === "" || visitante.faixa_etaria === filtroFaixaEtaria
    const matchSexo = filtroSexo === "" || visitante.sexo === filtroSexo

    return matchBusca && matchFaixaEtaria && matchSexo
  })

  return {
    visitantesFiltrados,
    termoBusca,
    setTermoBusca,
    filtroFaixaEtaria,
    setFiltroFaixaEtaria,
    filtroSexo,
    setFiltroSexo,
    limparFiltros: () => {
      setTermoBusca("")
      setFiltroFaixaEtaria("")
      setFiltroSexo("")
    },
  }
}
