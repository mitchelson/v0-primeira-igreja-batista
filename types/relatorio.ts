import type { VisitanteComResponsavel, IntencaoType, SexoType } from './supabase'

// Tipos para seleção de período
export interface PeriodoRelatorio {
  readonly mes: number // 1-12
  readonly ano: number
}

// Estatísticas do relatório
export interface EstatisticasRelatorio {
  readonly totalVisitantes: number
  readonly mensagensEnviadas: number
  readonly taxaEnvioMensagens: number
  readonly distribuicaoPorIntencao: Record<IntencaoType, number>
  readonly distribuicaoPorSexo: Record<SexoType, number>
  readonly cidadesMaisComuns: Array<{
    cidade: string
    quantidade: number
  }>
  readonly bairrosMaisComuns: Array<{
    bairro: string
    quantidade: number
  }>
}

// Dados completos do relatório
export interface DadosRelatorio {
  readonly periodo: PeriodoRelatorio
  readonly visitantes: readonly VisitanteComResponsavel[]
  readonly estatisticas: EstatisticasRelatorio
  readonly dataGeracao: Date
}

// Configurações do PDF
export interface ConfiguracoesPDF {
  readonly incluirGraficos: boolean
  readonly incluirDetalhesCompletos: boolean
  readonly orientacao: 'portrait' | 'landscape'
  readonly tamanhoFonte: number
}

// Props do modal de relatório
export interface RelatorioMensalDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly visitantes: readonly VisitanteComResponsavel[]
}

// Filtros para busca de visitantes por período
export interface FiltrosPeriodo {
  readonly dataInicio: Date
  readonly dataFim: Date
}

// Estado do hook de relatórios
export interface UseRelatoriosState {
  readonly loading: boolean
  readonly error: string | null
  readonly dadosRelatorio: DadosRelatorio | null
}

// Resultado da geração de relatório
export interface ResultadoRelatorio {
  readonly sucesso: boolean
  readonly nomeArquivo?: string
  readonly erro?: string
}
