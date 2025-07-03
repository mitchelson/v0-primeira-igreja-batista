"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  FileText,
  Download,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useRelatorios } from "@/hooks/use-relatorios";
import { gerarRelatorioPDF } from "@/lib/pdf-generator";
import type {
  RelatorioMensalDialogProps,
  PeriodoRelatorio,
} from "@/types/relatorio";

export default function RelatorioMensalDialog({
  isOpen,
  onClose,
  visitantes,
}: RelatorioMensalDialogProps) {
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  });
  const [gerando, setGerando] = useState(false);

  const {
    dadosRelatorio,
    loading,
    error,
    gerarDadosRelatorio,
    validarPeriodo,
    limparDados,
  } = useRelatorios();

  // Gerar opções de anos (últimos 5 anos + ano atual + próximo ano)
  const anosDisponiveis = React.useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual - 4; i <= anoAtual + 1; i++) {
      anos.push(i);
    }
    return anos;
  }, []);

  // Gerar opções de meses
  const mesesDisponiveis = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
  ];

  const handleVisualizarDados = async () => {
    if (!validarPeriodo(periodo)) {
      toast({
        variant: "destructive",
        title: "Período inválido",
        description: "Por favor, selecione um período válido.",
      });
      return;
    }

    try {
      await gerarDadosRelatorio(visitantes, periodo);
    } catch (err) {
      console.error("Erro ao gerar dados:", err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar dados",
        description: "Não foi possível gerar os dados do relatório.",
      });
    }
  };

  const handleGerarPDF = async () => {
    if (!dadosRelatorio) {
      toast({
        variant: "destructive",
        title: "Dados não disponíveis",
        description: "Por favor, visualize os dados primeiro.",
      });
      return;
    }

    setGerando(true);
    try {
      await gerarRelatorioPDF(dadosRelatorio);

      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado para seu computador.",
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF.",
      });
    } finally {
      setGerando(false);
    }
  };

  const handleClose = () => {
    limparDados();
    onClose();
  };

  const renderPreviewDados = () => {
    if (!dadosRelatorio) return null;

    const { estatisticas } = dadosRelatorio;

    return (
      <div className="space-y-4">
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estatísticas principais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Visitantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.totalVisitantes}
              </div>
              <p className="text-xs text-muted-foreground">
                no período selecionado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mensagens Enviadas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.mensagensEnviadas}
              </div>
              <p className="text-xs text-muted-foreground">
                de {estatisticas.totalVisitantes} visitantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Envio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.taxaEnvioMensagens.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                mensagens enviadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por intenção */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribuição por Intenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(estatisticas.distribuicaoPorIntencao).map(
                ([intencao, quantidade]) =>
                  quantidade > 0 && (
                    <Badge key={intencao} variant="secondary">
                      {intencao}: {quantidade}
                    </Badge>
                  )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cidades mais comuns */}
        {estatisticas.cidadesMaisComuns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Principais Cidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {estatisticas.cidadesMaisComuns
                  .slice(0, 5)
                  .map(({ cidade, quantidade }) => (
                    <Badge key={cidade} variant="outline">
                      {cidade}: {quantidade}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório Mensal de Visitantes
          </DialogTitle>
          <DialogDescription>
            Selecione o período e gere um relatório completo em PDF com os dados
            dos visitantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de período */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="select-mes" className="text-sm font-medium">
                Mês
              </label>
              <Select
                value={periodo.mes.toString()}
                onValueChange={(value) =>
                  setPeriodo((prev) => ({ ...prev, mes: parseInt(value) }))
                }
              >
                <SelectTrigger id="select-mes">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {mesesDisponiveis.map(({ valor, nome }) => (
                    <SelectItem key={valor} value={valor.toString()}>
                      {nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="select-ano" className="text-sm font-medium">
                Ano
              </label>
              <Select
                value={periodo.ano.toString()}
                onValueChange={(value) =>
                  setPeriodo((prev) => ({ ...prev, ano: parseInt(value) }))
                }
              >
                <SelectTrigger id="select-ano">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {anosDisponiveis.map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Preview dos dados */}
          {renderPreviewDados()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleVisualizarDados} disabled={loading}>
            {loading ? "Carregando..." : "Visualizar Dados do Período"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
