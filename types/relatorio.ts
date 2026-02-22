import type { VisitanteComResponsavel, SexoType, FaixaEtariaType } from "./supabase"

// Tipos para selecao de periodo
export interface PeriodoRelatorio {
  readonly mes: number // 1-12
  readonly ano: number
}

// Estatisticas do relatorio
export interface EstatisticasRelatorio {
  readonly totalVisitantes: number
  readonly mensagensEnviadas: number
  readonly taxaEnvioMensagens: number
  readonly distribuicaoPorFaixaEtaria: Record<string, number>
  readonly distribuicaoPorSexo: Record<string, number>
  readonly cidadesMaisComuns: Array<{
    cidade: string
    quantidade: number
  }>
  readonly bairrosMaisComuns: Array<{
    bairro: string
    quantidade: number
  }>
}

// Dados completos do relatorio
export interface DadosRelatorio {
  readonly periodo: PeriodoRelatorio
  readonly visitantes: readonly VisitanteComResponsavel[]
  readonly estatisticas: EstatisticasRelatorio
  readonly dataGeracao: Date
}

// Configuracoes do PDF
export interface ConfiguracoesPDF {
  readonly incluirGraficos: boolean
  readonly incluirDetalhesCompletos: boolean
  readonly orientacao: "portrait" | "landscape"
  readonly tamanhoFonte: number
}

// Props do modal de relatorio
export interface RelatorioMensalDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly visitantes: readonly VisitanteComResponsavel[]
}

// Estado do hook de relatorios
export interface UseRelatoriosState {
  readonly loading: boolean
  readonly error: string | null
  readonly dadosRelatorio: DadosRelatorio | null
}

// Resultado da geracao de relatorio
export interface ResultadoRelatorio {
  readonly sucesso: boolean
  readonly nomeArquivo?: string
  readonly erro?: string
}
