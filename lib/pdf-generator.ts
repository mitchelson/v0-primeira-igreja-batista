import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DadosRelatorio, ConfiguracoesPDF } from "@/types/relatorio"
import type { VisitanteComResponsavel } from "@/types/supabase"
import { CHURCH_INFO } from "@/lib/constants"

export class PDFGenerator {
  private doc: jsPDF
  private readonly configs: ConfiguracoesPDF

  constructor(
    configs: ConfiguracoesPDF = {
      incluirGraficos: false,
      incluirDetalhesCompletos: true,
      orientacao: "portrait",
      tamanhoFonte: 10,
    },
  ) {
    this.configs = configs
    this.doc = new jsPDF({
      orientation: configs.orientacao,
      unit: "mm",
      format: "a4",
    })
  }

  public async gerarRelatorio(dados: DadosRelatorio): Promise<void> {
    try {
      this.doc.setFont("helvetica")
      this.adicionarCabecalho(dados)
      this.adicionarResumoEstatistico(dados)
      this.adicionarTabelaVisitantes(dados.visitantes)
      this.adicionarRodape(dados.dataGeracao)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      throw new Error("Falha na geracao do relatorio PDF")
    }
  }

  private adicionarCabecalho(dados: DadosRelatorio): void {
    const pageWidth = this.doc.internal.pageSize.width

    this.doc.setFontSize(18)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(CHURCH_INFO.NAME, pageWidth / 2, 20, { align: "center" })

    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Relatorio Mensal de Visitantes", pageWidth / 2, 30, {
      align: "center",
    })

    const nomeMes = this.obterNomeMes(dados.periodo.mes)
    const periodo = `${nomeMes} de ${dados.periodo.ano}`
    this.doc.setFontSize(12)
    this.doc.text(`Periodo: ${periodo}`, pageWidth / 2, 40, {
      align: "center",
    })

    this.doc.line(20, 45, pageWidth - 20, 45)
  }

  private adicionarResumoEstatistico(dados: DadosRelatorio): void {
    const { estatisticas } = dados
    let yPosition = 55

    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Resumo Estatistico", 20, yPosition)
    yPosition += 15

    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")

    const estatisticasPrincipais = [
      `Total de Visitantes: ${estatisticas.totalVisitantes}`,
      `Mensagens Enviadas: ${estatisticas.mensagensEnviadas}`,
      `Taxa de Envio: ${estatisticas.taxaEnvioMensagens.toFixed(1)}%`,
    ]

    estatisticasPrincipais.forEach((texto) => {
      this.doc.text(texto, 25, yPosition)
      yPosition += 8
    })

    yPosition += 5

    // Distribuicao por faixa etaria
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Distribuicao por Faixa Etaria:", 25, yPosition)
    yPosition += 8

    this.doc.setFont("helvetica", "normal")
    Object.entries(estatisticas.distribuicaoPorFaixaEtaria).forEach(
      ([faixa, quantidade]) => {
        if (quantidade > 0) {
          this.doc.text(`- ${faixa}: ${quantidade}`, 30, yPosition)
          yPosition += 6
        }
      },
    )

    yPosition += 5

    // Distribuicao por sexo
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Distribuicao por Sexo:", 25, yPosition)
    yPosition += 8

    this.doc.setFont("helvetica", "normal")
    Object.entries(estatisticas.distribuicaoPorSexo).forEach(
      ([sexo, quantidade]) => {
        if (quantidade > 0) {
          this.doc.text(`- ${sexo}: ${quantidade}`, 30, yPosition)
          yPosition += 6
        }
      },
    )

    if (estatisticas.cidadesMaisComuns.length > 0) {
      yPosition += 5
      this.doc.setFont("helvetica", "bold")
      this.doc.text("Principais Cidades:", 25, yPosition)
      yPosition += 8

      this.doc.setFont("helvetica", "normal")
      estatisticas.cidadesMaisComuns
        .slice(0, 3)
        .forEach(({ cidade, quantidade }) => {
          this.doc.text(`- ${cidade}: ${quantidade}`, 30, yPosition)
          yPosition += 6
        })
    }
  }

  private adicionarTabelaVisitantes(
    visitantes: readonly VisitanteComResponsavel[],
  ): void {
    if (visitantes.length === 0) {
      this.doc.setFontSize(12)
      this.doc.text(
        "Nenhum visitante encontrado no periodo selecionado.",
        20,
        150,
      )
      return
    }

    ;(this.doc as any).autoTable({
      startY: 150,
      head: [
        [
          "Nome",
          "Data",
          "Celular",
          "Cidade",
          "Faixa Etaria",
          "Seg",
          "Sab",
        ],
      ],
      body: visitantes.map((visitante) => [
        visitante.nome,
        format(new Date(visitante.data_cadastro), "dd/MM/yyyy", {
          locale: ptBR,
        }),
        visitante.celular,
        visitante.cidade === "Outra" && visitante.cidade_outra
          ? visitante.cidade_outra
          : (visitante.cidade ?? "-"),
        visitante.faixa_etaria ?? "-",
        visitante.msg_segunda ? "Sim" : "Nao",
        visitante.msg_sabado ? "Sim" : "Nao",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 18 },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 12 },
        6: { cellWidth: 12 },
      },
    })
  }

  private adicionarRodape(dataGeracao: Date): void {
    const pageHeight = this.doc.internal.pageSize.height
    const pageWidth = this.doc.internal.pageSize.width

    this.doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)

    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal")

    const dataFormatada = format(dataGeracao, "dd/MM/yyyy 'as' HH:mm", {
      locale: ptBR,
    })
    this.doc.text(
      `Relatorio gerado em: ${dataFormatada}`,
      20,
      pageHeight - 20,
    )

    this.doc.text(
      `${CHURCH_INFO.NAME} - Sistema de Gestao de Visitantes`,
      pageWidth - 20,
      pageHeight - 20,
      { align: "right" },
    )
  }

  private obterNomeMes(mes: number): string {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Marco",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return meses[mes - 1] ?? "Mes Invalido"
  }

  public salvar(nomeArquivo: string): void {
    this.doc.save(nomeArquivo)
  }

  public obterBlob(): Blob {
    return this.doc.output("blob")
  }
}

export async function gerarRelatorioPDF(
  dados: DadosRelatorio,
  configs?: Partial<ConfiguracoesPDF>,
): Promise<void> {
  const configsCompletas: ConfiguracoesPDF = {
    incluirGraficos: false,
    incluirDetalhesCompletos: true,
    orientacao: "portrait",
    tamanhoFonte: 10,
    ...configs,
  }

  const generator = new PDFGenerator(configsCompletas)
  await generator.gerarRelatorio(dados)

  const nomeMes = generator["obterNomeMes"](dados.periodo.mes)
  const nomeArquivo = `relatorio-visitantes-${nomeMes.toLowerCase()}-${dados.periodo.ano}.pdf`

  generator.salvar(nomeArquivo)
}
