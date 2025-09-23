"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { formatarData } from "@/lib/utils";
import {
  Search,
  Plus,
  Check,
  User,
  AlertCircle,
  MessageSquare,
  FileText,
} from "lucide-react";
import VisitanteDialog from "@/components/visitante-dialog";
import NovoVisitanteDialog from "@/components/novo-visitante-dialog";
import RelatorioMensalDialog from "@/components/relatorio-mensal-dialog";
import { useAuth } from "@/contexts/auth-context";
import LoginForm from "@/components/login-form";
import type { Visitante } from "@/types/supabase";

// Interface estendida para incluir o nome do responsável
interface VisitanteComResponsavel extends Visitante {
  responsavel_nome?: string | null;
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const [visitantes, setVisitantes] = useState<VisitanteComResponsavel[]>([]);
  const [visitantesFiltrados, setVisitantesFiltrados] = useState<
    VisitanteComResponsavel[]
  >([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [visitanteSelecionado, setVisitanteSelecionado] =
    useState<VisitanteComResponsavel | null>(null);
  const [novoVisitanteDialogAberto, setNovoVisitanteDialogAberto] =
    useState(false);
  const [relatorioDialogAberto, setRelatorioDialogAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [datasAgrupadas, setDatasAgrupadas] = useState<string[]>([]);
  const [visitantesPorData, setVisitantesPorData] = useState<
    Record<string, VisitanteComResponsavel[]>
  >({});

  // Carregar visitantes apenas se estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      carregarVisitantes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (datasAgrupadas.length > 0 && !dataSelecionada) {
      setDataSelecionada(datasAgrupadas[0]);
    }
  }, [datasAgrupadas, dataSelecionada]);

  const carregarVisitantes = async () => {
    setCarregando(true);
    try {
      // Consulta com join para obter o nome do responsável
      const { data, error } = await supabase
        .from("visitantes")
        .select(
          `
          *,
          responsaveis (
            nome
          )
        `
        )
        .order("data_cadastro", { ascending: false });

      if (error) throw error;

      if (data) {
        // Transformar os dados para incluir o nome do responsável diretamente no objeto visitante
        const visitantesComResponsavel: VisitanteComResponsavel[] = data.map(
          (item: any) => ({
            ...item,
            responsavel_nome: item.responsaveis ? item.responsaveis.nome : null,
          })
        );

        setVisitantes(visitantesComResponsavel);
        setVisitantesFiltrados(visitantesComResponsavel);

        // Agrupar por data
        const grupos: Record<string, VisitanteComResponsavel[]> = {};
        visitantesComResponsavel.forEach((visitante) => {
          const dataFormatada = formatarData(visitante.data_cadastro);
          if (!grupos[dataFormatada]) {
            grupos[dataFormatada] = [];
          }
          grupos[dataFormatada].push(visitante);
        });

        setVisitantesPorData(grupos);
        setDatasAgrupadas(
          Object.keys(grupos).sort((a, b) => {
            const [diaA, mesA, anoA] = a.split("/").map(Number);
            const [diaB, mesB, anoB] = b.split("/").map(Number);
            if (anoA && anoB && mesA && mesB && diaA && diaB)
              return (
                new Date(anoB, mesB - 1, diaB).getTime() -
                new Date(anoA, mesA - 1, diaA).getTime()
              );
            return 0;
          })
        );
      }
    } catch (error) {
      console.error("Erro ao carregar visitantes:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Filtrar visitantes quando o termo de busca mudar
  useEffect(() => {
    if (termoBusca.trim() === "") {
      setVisitantesFiltrados(visitantes);

      // Reagrupar todos os visitantes
      const grupos: Record<string, VisitanteComResponsavel[]> = {};
      visitantes.forEach((visitante) => {
        const dataFormatada = formatarData(visitante.data_cadastro);
        if (!grupos[dataFormatada]) {
          grupos[dataFormatada] = [];
        }
        grupos[dataFormatada].push(visitante);
      });

      setVisitantesPorData(grupos);
      setDatasAgrupadas(
        Object.keys(grupos).sort((a, b) => {
          const [diaA, mesA, anoA] = a.split("/").map(Number);
          const [diaB, mesB, anoB] = b.split("/").map(Number);
          if (anoA && anoB && mesA && mesB && diaA && diaB)
            return (
              new Date(anoB, mesB - 1, diaB).getTime() -
              new Date(anoA, mesA - 1, diaA).getTime()
            );
          return 0; // Se não puder comparar, retorna 0
        })
      );
    } else {
      const termo = termoBusca.toLowerCase();
      const filtrados = visitantes.filter(
        (v) =>
          v.nome.toLowerCase().includes(termo) ||
          v.celular.includes(termo) ||
          v.responsavel_nome?.toLowerCase().includes(termo)
      );
      setVisitantesFiltrados(filtrados);

      // Reagrupar visitantes filtrados
      const grupos: Record<string, VisitanteComResponsavel[]> = {};
      filtrados.forEach((visitante) => {
        const dataFormatada = formatarData(visitante.data_cadastro);
        if (!grupos[dataFormatada]) {
          grupos[dataFormatada] = [];
        }
        grupos[dataFormatada].push(visitante);
      });

      setVisitantesPorData(grupos);
      setDatasAgrupadas(
        Object.keys(grupos).sort((a, b) => {
          const [diaA, mesA, anoA] = a.split("/").map(Number);
          const [diaB, mesB, anoB] = b.split("/").map(Number);
          if (anoA && anoB && mesA && mesB && diaA && diaB)
            return (
              new Date(anoB, mesB - 1, diaB).getTime() -
              new Date(anoA, mesA - 1, diaA).getTime()
            );
          return 0; // Se não puder comparar, retorna 0
        })
      );
    }
  }, [termoBusca, visitantes]);

  const handleVisitanteAtualizado = (visitanteAtualizado: Visitante) => {
    setVisitantes((prev) =>
      prev.map((v) =>
        v.id === visitanteAtualizado.id
          ? {
              ...visitanteAtualizado,
              responsavel_nome:
                v.responsavel_nome !== undefined ? v.responsavel_nome : null,
            }
          : v
      )
    );
    setVisitanteSelecionado(null);
    carregarVisitantes(); // Recarregar para garantir dados atualizados
  };

  const handleNovoVisitante = (novoVisitante: Visitante) => {
    carregarVisitantes(); // Recarregar para incluir o novo visitante
    setNovoVisitanteDialogAberto(false);
  };

  // Se não estiver autenticado, exibe o formulário de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Administração de Visitantes</CardTitle>
              <CardDescription>
                Gerencie os visitantes cadastrados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setRelatorioDialogAberto(true)}
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" /> Relatório Mensal
              </Button>
              <Button onClick={() => setNovoVisitanteDialogAberto(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo Visitante
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou responsável"
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          {visitantesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {termoBusca
                ? "Nenhum visitante encontrado para esta busca."
                : "Nenhum visitante cadastrado."}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select para escolher a data */}
              {datasAgrupadas.length > 1 && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="select-data"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Data:
                  </label>
                  <Select
                    value={dataSelecionada}
                    onValueChange={setDataSelecionada}
                  >
                    <SelectTrigger id="select-data" className="w-40">
                      <SelectValue placeholder="Selecione uma data" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasAgrupadas.map((data) => (
                        <SelectItem key={data} value={data}>
                          {data}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lista de visitantes da data selecionada */}
              <div className="space-y-4">
                {dataSelecionada &&
                  visitantesPorData[dataSelecionada]?.map((visitante) => (
                    <button
                      key={visitante.id}
                      className="flex flex-row w-full items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => setVisitanteSelecionado(visitante)}
                    >
                      <div className="flex flex-col text-left align-start justify-start">
                        <h3 className="font-medium text-left">
                          {visitante.nome}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                          <span>{visitante.celular}</span>
                          {visitante.responsavel_nome && (
                            <div className="flex items-center text-emerald-600">
                              <User className="h-3 w-3 mr-1" />
                              <span>Resp: {visitante.responsavel_nome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {visitante.sem_whatsapp ? (
                          <div className="flex items-center text-slate-500">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Sem WhatsApp</span>
                          </div>
                        ) : visitante.mensagem_enviada ? (
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm">Mensagem enviada</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span className="text-sm">Pendente</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {visitanteSelecionado && (
        <VisitanteDialog
          visitante={visitanteSelecionado}
          onClose={() => setVisitanteSelecionado(null)}
          onUpdate={handleVisitanteAtualizado}
        />
      )}

      {novoVisitanteDialogAberto && (
        <NovoVisitanteDialog
          onClose={() => setNovoVisitanteDialogAberto(false)}
          onSave={handleNovoVisitante}
        />
      )}

      <RelatorioMensalDialog
        isOpen={relatorioDialogAberto}
        onClose={() => setRelatorioDialogAberto(false)}
        visitantes={visitantes}
      />
    </div>
  );
}
