import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosRelatorio, ConfiguracoesPDF } from '@/types/relatorio'
import type { VisitanteComResponsavel } from '@/types/supabase'
import { CHURCH_INFO } from '@/lib/constants'

export class PDFGenerator {
  private doc: jsPDF
  private readonly configs: ConfiguracoesPDF

  constructor(configs: ConfiguracoesPDF = {
    incluirGraficos: false,
    incluirDetalhesCompletos: true,
    orientacao: 'portrait',
    tamanhoFonte: 10
  }) {
    this.configs = configs
    this.doc = new jsPDF({
      orientation: configs.orientacao,
      unit: 'mm',
      format: 'a4'
    })
  }

  public async gerarRelatorio(dados: DadosRelatorio): Promise<void> {
    try {
      // Configurar fonte
      this.doc.setFont('helvetica')

      // Adicionar cabeçalho
      this.adicionarCabecalho(dados)

      // Adicionar resumo estatístico
      this.adicionarResumoEstatistico(dados)

      // Adicionar tabela de visitantes
      this.adicionarTabelaVisitantes(dados.visitantes)

      // Adicionar gráficos (se solicitado)
      if (this.configs.incluirGraficos) {
        this.adicionarGraficos(dados)
      }

      // Adicionar rodapé
      this.adicionarRodape(dados.dataGeracao)

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw new Error('Falha na geração do relatório PDF')
    }
  }

  private adicionarCabecalho(dados: DadosRelatorio): void {
    const pageWidth = this.doc.internal.pageSize.width

    // Título principal
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(CHURCH_INFO.NAME, pageWidth / 2, 20, { align: 'center' })

    // Subtítulo
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Relatório Mensal de Visitantes', pageWidth / 2, 30, { align: 'center' })

    // Período
    const nomeMes = this.obterNomeMes(dados.periodo.mes)
    const periodo = `${nomeMes} de ${dados.periodo.ano}`
    this.doc.setFontSize(12)
    this.doc.text(`Período: ${periodo}`, pageWidth / 2, 40, { align: 'center' })

    // Linha separadora
    this.doc.line(20, 45, pageWidth - 20, 45)
  }

  private adicionarResumoEstatistico(dados: DadosRelatorio): void {
    const { estatisticas } = dados
    let yPosition = 55

    // Título da seção
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Resumo Estatístico', 20, yPosition)
    yPosition += 15

    // Estatísticas principais
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    const estatisticasPrincipais = [
      `Total de Visitantes: ${estatisticas.totalVisitantes}`,
      `Mensagens Enviadas: ${estatisticas.mensagensEnviadas}`,
      `Taxa de Envio: ${estatisticas.taxaEnvioMensagens.toFixed(1)}%`
    ]

    estatisticasPrincipais.forEach(texto => {
      this.doc.text(texto, 25, yPosition)
      yPosition += 8
    })

    yPosition += 5

    // Distribuição por intenção
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Distribuição por Intenção:', 25, yPosition)
    yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    Object.entries(estatisticas.distribuicaoPorIntencao).forEach(([intencao, quantidade]) => {
      if (quantidade > 0) {
        this.doc.text(`• ${intencao}: ${quantidade}`, 30, yPosition)
        yPosition += 6
      }
    })

    yPosition += 5

    // Distribuição por sexo
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Distribuição por Sexo:', 25, yPosition)
    yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    Object.entries(estatisticas.distribuicaoPorSexo).forEach(([sexo, quantidade]) => {
      if (quantidade > 0) {
        this.doc.text(`• ${sexo}: ${quantidade}`, 30, yPosition)
        yPosition += 6
      }
    })

    // Cidades mais comuns (se houver)
    if (estatisticas.cidadesMaisComuns.length > 0) {
      yPosition += 5
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Principais Cidades:', 25, yPosition)
      yPosition += 8

      this.doc.setFont('helvetica', 'normal')
      estatisticas.cidadesMaisComuns.slice(0, 3).forEach(({ cidade, quantidade }) => {
        this.doc.text(`• ${cidade}: ${quantidade}`, 30, yPosition)
        yPosition += 6
      })
    }
  }

  private adicionarTabelaVisitantes(visitantes: readonly VisitanteComResponsavel[]): void {
    if (visitantes.length === 0) {
      this.doc.setFontSize(12)
      this.doc.text('Nenhum visitante encontrado no período selecionado.', 20, 150)
      return
    }

    // Gerar tabela usando casting para any (necessário para jsPDF-autoTable)
    (this.doc as any).autoTable({
      startY: 150,
      head: [['Nome', 'Data', 'Telefone', 'Cidade', 'Intenção', 'Msg Enviada']],
      body: visitantes.map(visitante => [
        visitante.nome,
        format(new Date(visitante.data_cadastro), 'dd/MM/yyyy', { locale: ptBR }),
        visitante.celular,
        visitante.cidade ?? '-',
        this.abreviarIntencao(visitante.intencao),
        visitante.mensagem_enviada ? 'Sim' : 'Não'
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Nome
        1: { cellWidth: 20 }, // Data
        2: { cellWidth: 30 }, // Telefone
        3: { cellWidth: 25 }, // Cidade
        4: { cellWidth: 35 }, // Intenção
        5: { cellWidth: 20 }  // Mensagem
      }
    })
  }

  private adicionarGraficos(dados: DadosRelatorio): void {
    // Placeholder para gráficos futuros
    // Pode ser implementado com canvas2pdf ou similar
    const yPosition = (this.doc as any).lastAutoTable.finalY + 20

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Gráficos Estatísticos', 20, yPosition)

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'italic')
    this.doc.text('(Funcionalidade de gráficos será implementada em versão futura)', 20, yPosition + 10)
  }

  private adicionarRodape(dataGeracao: Date): void {
    const pageHeight = this.doc.internal.pageSize.height
    const pageWidth = this.doc.internal.pageSize.width

    // Linha separadora
    this.doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)

    // Texto do rodapé
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')

    const dataFormatada = format(dataGeracao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    this.doc.text(`Relatório gerado em: ${dataFormatada}`, 20, pageHeight - 20)

    this.doc.text(
      `${CHURCH_INFO.NAME} - Sistema de Gestão de Visitantes`,
      pageWidth - 20,
      pageHeight - 20,
      { align: 'right' }
    )
  }

  private obterNomeMes(mes: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[mes - 1] ?? 'Mês Inválido'
  }

  private abreviarIntencao(intencao: string): string {
    const abreviacoes: Record<string, string> = {
      'Sou membro de outra igreja': 'Membro Outra',
      'Gostaria de conhecer melhor': 'Conhecer Melhor',
      'Quero ser membro': 'Ser Membro'
    }
    return abreviacoes[intencao] ?? intencao
  }

  public salvar(nomeArquivo: string): void {
    this.doc.save(nomeArquivo)
  }

  public obterBlob(): Blob {
    return this.doc.output('blob')
  }
}

// Função utilitária para gerar relatório completo
export async function gerarRelatorioPDF(
  dados: DadosRelatorio,
  configs?: Partial<ConfiguracoesPDF>
): Promise<void> {
  const configsCompletas: ConfiguracoesPDF = {
    incluirGraficos: false,
    incluirDetalhesCompletos: true,
    orientacao: 'portrait',
    tamanhoFonte: 10,
    ...configs
  }

  const generator = new PDFGenerator(configsCompletas)
  await generator.gerarRelatorio(dados)

  const nomeMes = generator['obterNomeMes'](dados.periodo.mes)
  const nomeArquivo = `relatorio-visitantes-${nomeMes.toLowerCase()}-${dados.periodo.ano}.pdf`

  generator.salvar(nomeArquivo)
}
