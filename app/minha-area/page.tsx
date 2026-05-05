import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, ClipboardList } from "lucide-react";
import Header from "@/components/header";
import { EscalaCard } from "./escala-card";
import { PendenciasMensagens } from "./pendencias-mensagens";
import { SolicitarMinisterio } from "./solicitar-ministerio";
import { PushNotificationRegister } from "@/components/push-notification-register";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { EditarNome } from "./editar-nome";

export default async function MinhaAreaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [eventos, ministerios, userInfo] = await Promise.all([
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-1">
              Olá, {session.user.name?.split(" ")[0]}! 👋
              <EditarNome nomeAtual={session.user.name ?? ""} />
            </h1>
            {pendentes > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Você tem{" "}
                <span className="font-semibold text-orange-600">
                  {pendentes}
                </span>{" "}
                escala{pendentes > 1 ? "s" : ""} pendente
                {pendentes > 1 ? "s" : ""}
              </p>
            )}
            {pendentes === 0 && eventos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Tudo em dia! ✅
              </p>
            )}
          </div>

          <PushNotificationRegister />

          <PendenciasMensagens />

          {ministerios.length === 0 && <SolicitarMinisterio />}

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
                Próximas Escalas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma escala futura
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventos.map((e: any) => {
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
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ministérios */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="h-5 w-5 text-primary" />
                Meus Ministérios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ministerios.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum ministério vinculado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {ministerios.map((m: any) => (
                    <div
                      key={m.nome}
                      className="flex items-center gap-3 rounded-xl border p-3"
                      style={{
                        borderLeftWidth: 4,
                        borderLeftColor: m.cor || "hsl(var(--primary))",
                      }}
                    >
                      <span className="text-xl">{m.icone || "🎵"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{m.nome}</p>
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
        </div>
      </PullToRefresh>
    </div>
  );
}
