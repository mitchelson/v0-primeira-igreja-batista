import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, ClipboardList, Clock, MapPin, Users } from "lucide-react";
import Header from "@/components/header";
import { EscalaActions } from "./escala-actions";
import { PendenciasMensagens } from "./pendencias-mensagens";
import { SolicitarMinisterio } from "./solicitar-ministerio";
import { PushNotificationRegister } from "@/components/push-notification-register";
import { PullToRefresh } from "@/components/pull-to-refresh";

export default async function MinhaAreaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [escalas, ministerios, userInfo] = await Promise.all([
    sql`
      SELECT e.id, e.funcao, e.status, e.evento_id, e.ministerio_id, ev.titulo, ev.data, ev.horario, m.nome as ministerio
      FROM escalas e
      JOIN eventos ev ON ev.id = e.evento_id
      JOIN ministerios m ON m.id = e.ministerio_id
      WHERE e.user_id = ${userId} AND ev.data >= CURRENT_DATE
      ORDER BY ev.data ASC
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

  // Buscar colegas de escala (mesmo evento + mesmo ministério)
  const escalaIds = escalas.map((e: any) => ({ evento_id: e.evento_id, ministerio_id: e.ministerio_id }));
  let colegas: Record<string, any[]> = {};
  if (escalaIds.length > 0) {
    const colegasRows = await sql`
      SELECT e.evento_id, e.ministerio_id, u.nome, e.funcao
      FROM escalas e
      JOIN users u ON u.id = e.user_id
      WHERE e.user_id != ${userId}
        AND (e.evento_id, e.ministerio_id) IN (
          SELECT evento_id, ministerio_id FROM escalas WHERE user_id = ${userId}
            AND evento_id IN (SELECT id FROM eventos WHERE data >= CURRENT_DATE)
        )
      ORDER BY u.nome
    `;
    for (const c of colegasRows) {
      const key = `${c.evento_id}_${c.ministerio_id}`;
      if (!colegas[key]) colegas[key] = [];
      colegas[key].push(c);
    }
  }

  const isNewUser =
    userInfo[0] &&
    Date.now() - new Date(userInfo[0].criado_em).getTime() < 60_000;

  const pendentes = escalas.filter((e: any) => e.status === "pendente").length;

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
            <h1 className="text-2xl font-bold tracking-tight">
              Olá, {session.user.name?.split(" ")[0]}! 👋
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
            {pendentes === 0 && escalas.length > 0 && (
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
              {escalas.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma escala futura
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {escalas.map((e: any) => {
                    const data = new Date(e.data);
                    const dia = data.toLocaleDateString("pt-BR", {
                      day: "2-digit", timeZone: "UTC",
                    });
                    const mes = data
                      .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
                      .replace(".", "");
                    const diaSemana = data
                      .toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" })
                      .replace(".", "");

                    return (
                      <div
                        key={e.id}
                        className="rounded-xl border bg-card overflow-hidden"
                      >
                        <div className="flex items-stretch">
                          {/* Date sidebar */}
                          <div className="flex flex-col items-center justify-center bg-primary/10 text-primary w-16 py-4 shrink-0">
                            <span className="text-2xl font-bold leading-none">
                              {dia}
                            </span>
                            <span className="text-[10px] uppercase font-semibold tracking-wide mt-1">
                              {mes}
                            </span>
                            <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
                              {diaSemana}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex flex-col justify-between flex-1 min-w-0 p-3 gap-2">
                            <p className="font-semibold text-sm leading-tight">
                              {e.titulo}
                            </p>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                {e.horario && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {e.horario}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <span className="text-xl">
                                    {e.icone || ""}
                                  </span>
                                  {e.ministerio}
                                </span>
                                {e.funcao && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[11px] font-normal"
                                  >
                                    {e.funcao}
                                  </Badge>
                                )}
                              </div>
                              <div className="shrink-0">
                                <EscalaActions id={e.id} status={e.status} />
                              </div>
                            </div>

                            {/* Colegas de escala */}
                            {(() => {
                              const key = `${e.evento_id}_${e.ministerio_id}`;
                              const cols = colegas[key];
                              if (!cols?.length) return null;
                              return (
                                <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground border-t pt-1.5">
                                  <Users className="h-3 w-3 shrink-0" />
                                  {cols.map((c: any, i: number) => (
                                    <span key={i}>{c.nome}{c.funcao ? ` (${c.funcao})` : ""}{i < cols.length - 1 ? "," : ""}</span>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
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
