import { useState, useCallback } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'
import type {
  PeriodoRelatorio,
  DadosRelatorio,
  EstatisticasRelatorio,
  UseRelatoriosState
} from '@/types/relatorio'
import type { VisitanteComResponsavel, IntencaoType, SexoType } from '@/types/supabase'
import { IntencaoEnum, SexoEnum } from '@/types/supabase'

export function useRelatorios() {
  const [state, setState] = useState<UseRelatoriosState>({
    loading: false,
    error: null,
    dadosRelatorio: null
  })

  // Função para filtrar visitantes por período
  const filtrarVisitantesPorPeriodo = useCallback((
    visitantes: readonly VisitanteComResponsavel[],
    periodo: PeriodoRelatorio
  ): VisitanteComResponsavel[] => {
    const dataInicio = startOfMonth(new Date(periodo.ano, periodo.mes - 1))
    const dataFim = endOfMonth(new Date(periodo.ano, periodo.mes - 1))

    return visitantes.filter(visitante => {
      const dataVisitante = parseISO(visitante.data_cadastro)
      return isWithinInterval(dataVisitante, { start: dataInicio, end: dataFim })
    })
  }, [])

  // Função para calcular estatísticas
  const calcularEstatisticas = useCallback((
    visitantes: readonly VisitanteComResponsavel[]
  ): EstatisticasRelatorio => {
    const totalVisitantes = visitantes.length
    const mensagensEnviadas = visitantes.filter(v => v.mensagem_enviada).length
    const taxaEnvioMensagens = totalVisitantes > 0 ? (mensagensEnviadas / totalVisitantes) * 100 : 0

    // Distribuição por intenção
    const distribuicaoPorIntencao = Object.values(IntencaoEnum).reduce((acc, intencao) => {
      acc[intencao] = visitantes.filter(v => v.intencao === intencao).length
      return acc
    }, {} as Record<IntencaoType, number>)

    // Distribuição por sexo
    const distribuicaoPorSexo = Object.values(SexoEnum).reduce((acc, sexo) => {
      acc[sexo] = visitantes.filter(v => v.sexo === sexo).length
      return acc
    }, {} as Record<SexoType, number>)

    // Cidades mais comuns
    const cidadesMap = visitantes.reduce((acc, v) => {
      if (v.cidade) {
        acc[v.cidade] = (acc[v.cidade] ?? 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const cidadesMaisComuns = Object.entries(cidadesMap)
      .map(([cidade, quantidade]) => ({ cidade, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5)

    // Bairros mais comuns
    const bairrosMap = visitantes.reduce((acc, v) => {
      if (v.bairro) {
        acc[v.bairro] = (acc[v.bairro] ?? 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const bairrosMaisComuns = Object.entries(bairrosMap)
      .map(([bairro, quantidade]) => ({ bairro, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5)

    return {
      totalVisitantes,
      mensagensEnviadas,
      taxaEnvioMensagens,
      distribuicaoPorIntencao,
      distribuicaoPorSexo,
      cidadesMaisComuns,
      bairrosMaisComuns
    }
  }, [])

  // Função principal para gerar dados do relatório
  const gerarDadosRelatorio = useCallback(async (
    visitantesTodos: readonly VisitanteComResponsavel[],
    periodo: PeriodoRelatorio
  ): Promise<DadosRelatorio> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Filtrar visitantes do período
      const visitantesFiltrados = filtrarVisitantesPorPeriodo(visitantesTodos, periodo)

      // Calcular estatísticas
      const estatisticas = calcularEstatisticas(visitantesFiltrados)

      const dadosRelatorio: DadosRelatorio = {
        periodo,
        visitantes: visitantesFiltrados,
        estatisticas,
        dataGeracao: new Date()
      }

      setState(prev => ({
        ...prev,
        loading: false,
        dadosRelatorio
      }))

      return dadosRelatorio
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar relatório'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        dadosRelatorio: null
      }))
      throw new Error(errorMessage)
    }
  }, [filtrarVisitantesPorPeriodo, calcularEstatisticas])

  // Função para limpar dados
  const limparDados = useCallback(() => {
    setState({
      loading: false,
      error: null,
      dadosRelatorio: null
    })
  }, [])

  // Função para obter nome do mês
  const obterNomeMes = useCallback((mes: number): string => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[mes - 1] ?? 'Mês Inválido'
  }, [])

  // Função para validar período
  const validarPeriodo = useCallback((periodo: PeriodoRelatorio): boolean => {
    const { mes, ano } = periodo
    const anoAtual = new Date().getFullYear()

    return mes >= 1 && mes <= 12 && ano >= 2020 && ano <= anoAtual + 1
  }, [])

  return {
    ...state,
    gerarDadosRelatorio,
    limparDados,
    obterNomeMes,
    validarPeriodo,
    // Funções auxiliares expostas para uso externo se necessário
    filtrarVisitantesPorPeriodo,
    calcularEstatisticas
  }
}
