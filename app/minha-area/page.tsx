import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, ClipboardList, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import { EscalaCard } from "./escala-card";
import { PendenciasMensagens } from "./pendencias-mensagens";
import { SolicitarMinisterio } from "./solicitar-ministerio";
import { PushNotificationRegister } from "@/components/push-notification-register";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { EditarNome } from "./editar-nome";

export default async function MinhaAreaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [eventos, ministerios, userInfo, giftResults] = await Promise.all([
    sql`
      SELECT e.id, e.titulo, e.data, e.horario, e.observacoes,
             CASE WHEN es.user_id IS NOT NULL THEN true ELSE false END as is_escalado,
             es.id as escala_id, es.funcao as minha_funcao, es.status as meu_status, es.observacao as minha_observacao,
             m.nome as ministerio, m.icone, m.cor
      FROM eventos e
      LEFT JOIN escalas es ON es.evento_id = e.id AND es.user_id = ${userId}
      LEFT JOIN ministerios m ON m.id = es.ministerio_id
      WHERE e.data >= CURRENT_DATE
      ORDER BY e.data ASC
      LIMIT 4
    `,
    sql`
      SELECT m.nome, m.icone, m.cor, mm.is_lider
      FROM ministerio_membros mm
      JOIN ministerios m ON m.id = mm.ministerio_id
      WHERE mm.user_id = ${userId} AND m.ativo = true
      ORDER BY m.nome
    `,
    sql`SELECT criado_em FROM users WHERE id = ${userId}`,
    sql`SELECT results FROM user_gift_results WHERE user_id = ${userId}`,
  ]);

  // Buscar colegas de escala para cada evento
  const eventoIds = eventos.map((e: any) => e.id);
  let colegasPorEvento: Record<string, any[]> = {};
  if (eventoIds.length > 0) {
    const colegasRows = await sql`
      SELECT e.evento_id, u.nome, u.foto_url, e.funcao, m.nome as ministerio
      FROM escalas e
      JOIN users u ON u.id = e.user_id
      JOIN ministerios m ON m.id = e.ministerio_id
      WHERE e.evento_id = ANY(${eventoIds})
      ORDER BY m.nome, u.nome
    `;
    for (const c of colegasRows) {
      if (!colegasPorEvento[c.evento_id]) colegasPorEvento[c.evento_id] = [];
      colegasPorEvento[c.evento_id].push({
        nome: c.nome,
        foto_url: c.foto_url,
        funcao: c.funcao,
        ministerio: c.ministerio,
      });
    }
  }

  const isNewUser =
    userInfo[0] &&
    Date.now() - new Date(userInfo[0].criado_em).getTime() < 60_000;

  const pendentes = eventos.filter(
    (e: any) => e.is_escalado && e.meu_status === "pendente",
  ).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <PullToRefresh>
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
          {isNewUser && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-lg font-semibold text-green-800">
                ✅ Cadastro efetuado com sucesso!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Bem-vindo(a) à Primeira Igreja Batista de Roraima
              </p>
            </div>
          )}
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-1">
                Olá, {session.user.name?.split(" ")[0]}! 👋
                <EditarNome nomeAtual={session.user.name ?? ""} />
              </h1>
              {pendentes > 0 && (
                <p className="text-[13px] text-gray-500 mt-1">
                  Você tem{" "}
                  <span className="font-semibold text-orange-600">
                    {pendentes}
                  </span>{" "}
                  escala{pendentes > 1 ? "s" : ""} pendente
                  {pendentes > 1 ? "s" : ""}
                </p>
              )}
              {pendentes === 0 && eventos.length > 0 && (
                <p className="text-[13px] text-green-600 mt-1">
                  Tudo em dia! ✅
                </p>
              )}
            </div>
          </div>

          <PushNotificationRegister />
          <PwaInstallPrompt />

          <PendenciasMensagens />

          {ministerios.length === 0 && <SolicitarMinisterio />}

          <Card className="rounded-2xl border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <ClipboardList className="h-4 w-4 text-gray-500" />
                Próximas Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-500">
                    Nenhuma escala futura
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {eventos.map((e: any, i: number) => {
                    const cols = colegasPorEvento[e.id] || [];
                    return (
                      <EscalaCard
                        key={e.id}
                        evento={{
                          id: e.id,
                          titulo: e.titulo,
                          data: e.data,
                          horario: e.horario,
                          observacoes: e.observacoes,
                          is_escalado: e.is_escalado,
                          escala_id: e.escala_id,
                          minha_funcao: e.minha_funcao,
                          meu_status: e.meu_status,
                          minha_observacao: e.minha_observacao,
                          ministerio: e.ministerio,
                          icone: e.icone,
                        }}
                        colegas={cols}
                        userName={session.user.name?.split(" ")[0] || ""}
                        isNext={i === 0}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ministérios */}
          <Card className="rounded-2xl border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Music className="h-4 w-4 text-gray-500" />
                Meus Ministérios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ministerios.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-500">
                    Nenhum ministério vinculado
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {ministerios.map((m: any) => (
                    <div
                      key={m.nome}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                      style={{
                        borderLeftWidth: 4,
                        borderLeftColor: m.cor || "hsl(var(--primary))",
                      }}
                    >
                      <span className="text-xl">{m.icone || "🎵"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {m.nome}
                        </p>
                        {m.is_lider && (
                          <span className="text-[11px] text-amber-600 font-medium">
                            ★ Líder
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulários */}
          <Card className="rounded-2xl border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <BookOpen className="h-4 w-4 text-gray-500" />
                Formulários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/form-dons-espirituais"
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-muted/50 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-purple-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Formulário dos Dons Espirituais</p>
                </div>
                <span className="text-gray-400 text-xs">→</span>
              </Link>
              <Link
                href="/form-ministerios"
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-muted/50 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Formulário dos Ministérios - Semeadura 2026.1</p>
                </div>
                <span className="text-gray-400 text-xs">→</span>
              </Link>
            </CardContent>
          </Card>

          {/* Dons Espirituais */}
          <Card className="rounded-2xl border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Sparkles className="h-4 w-4 text-gray-500" />
                Dons Espirituais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {giftResults[0]?.results ? (
                <div className="space-y-2">
                  {(giftResults[0].results as any[]).filter((r: any) => r.rank <= 3).map((r: any) => (
                    <div key={r.gift} className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <span className="text-sm font-bold text-green-700">{r.rank}°</span>
                      <p className="text-sm font-medium text-green-800 flex-1">{r.gift}</p>
                      <span className="text-sm text-green-600 font-semibold">{r.score}/12</span>
                    </div>
                  ))}
                  <Link href="/form-dons-espirituais" className="block text-center text-xs text-muted-foreground hover:underline mt-2">
                    Ver resultado completo ou refazer
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Sparkles className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-500 mb-3">Descubra seus dons espirituais</p>
                  <Link href="/form-dons-espirituais" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Fazer o teste
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PullToRefresh>
    </div>
  );
}
