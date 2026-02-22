import { useState, useCallback } from "react"
import type {
  Visitante,
  VisitanteInsert,
  VisitanteUpdate,
  VisitanteComResponsavel,
} from "@/types/supabase"

export function useVisitantes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarTodos = useCallback(async (): Promise<VisitanteComResponsavel[]> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/visitantes")
      if (!res.ok) throw new Error("Erro ao buscar visitantes")
      const data = await res.json()
      return data as VisitanteComResponsavel[]
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao buscar visitantes"
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const buscarPorId = useCallback(
    async (id: string): Promise<Visitante | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/visitantes/${id}`)
        if (!res.ok) throw new Error("Erro ao buscar visitante")
        return (await res.json()) as Visitante
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Erro ao buscar visitante"
        setError(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const criar = useCallback(
    async (visitanteData: VisitanteInsert): Promise<Visitante | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/visitantes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitanteData),
        })
        if (!res.ok) throw new Error("Erro ao criar visitante")
        return (await res.json()) as Visitante
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Erro ao criar visitante"
        setError(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const atualizar = useCallback(
    async (
      id: string,
      visitanteData: VisitanteUpdate,
    ): Promise<Visitante | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/visitantes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitanteData),
        })
        if (!res.ok) throw new Error("Erro ao atualizar visitante")
        return (await res.json()) as Visitante
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Erro ao atualizar visitante"
        setError(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const deletar = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/visitantes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao deletar visitante")
      return true
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao deletar visitante"
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    buscarTodos,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    loading,
    error,
    clearError: () => setError(null),
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
