import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Visitante, VisitanteInsert, VisitanteUpdate, VisitanteComResponsavel } from '@/types/supabase'
import { SUPABASE_CONFIG } from '@/lib/constants'

// Hook para operações de visitantes
export function useVisitantes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarTodos = useCallback(async (): Promise<VisitanteComResponsavel[]> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .select(`
          *,
          responsaveis (nome)
        `)
        .order('data_cadastro', { ascending: false })

      if (supabaseError) throw supabaseError

      // Transforma os dados para incluir responsavel_nome
      const visitantesComResponsavel: VisitanteComResponsavel[] = data?.map(visitante => ({
        ...visitante,
        responsavel_nome: visitante.responsaveis?.nome ?? null
      })) ?? []

      return visitantesComResponsavel
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar visitantes'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const buscarPorId = useCallback(async (id: string): Promise<Visitante | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) throw supabaseError

      return data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar visitante'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const criar = useCallback(async (visitanteData: VisitanteInsert): Promise<Visitante | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .insert(visitanteData)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      return data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar visitante'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const atualizar = useCallback(async (id: string, visitanteData: VisitanteUpdate): Promise<Visitante | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .update(visitanteData)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      return data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar visitante'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletar = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar visitante'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const marcarMensagemEnviada = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAMES.VISITANTES)
        .update({ mensagem_enviada: true })
        .eq('id', id)

      if (supabaseError) throw supabaseError

      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao marcar mensagem como enviada'
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
    marcarMensagemEnviada,
    loading,
    error,
    clearError: () => setError(null)
  }
}

// Hook para filtros e busca
export function useFiltrosVisitantes(visitantes: VisitanteComResponsavel[]) {
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroIntencao, setFiltroIntencao] = useState<string>('')
  const [filtroSexo, setFiltroSexo] = useState<string>('')

  const visitantesFiltrados = visitantes.filter(visitante => {
    const matchBusca = termoBusca === '' ||
      visitante.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      visitante.celular.includes(termoBusca) ||
      visitante.cidade?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      visitante.bairro?.toLowerCase().includes(termoBusca.toLowerCase())

    const matchIntencao = filtroIntencao === '' || visitante.intencao === filtroIntencao
    const matchSexo = filtroSexo === '' || visitante.sexo === filtroSexo

    return matchBusca && matchIntencao && matchSexo
  })

  return {
    visitantesFiltrados,
    termoBusca,
    setTermoBusca,
    filtroIntencao,
    setFiltroIntencao,
    filtroSexo,
    setFiltroSexo,
    limparFiltros: () => {
      setTermoBusca('')
      setFiltroIntencao('')
      setFiltroSexo('')
    }
  }
}
