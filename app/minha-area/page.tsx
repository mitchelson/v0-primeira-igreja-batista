import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Music,
  ClipboardList,
} from "lucide-react";
import Header from "@/components/header";
import { EscalaCard } from "./escala-card";
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
  const escalaIds = escalas.map((e: any) => ({
    evento_id: e.evento_id,
    ministerio_id: e.ministerio_id,
  }));
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
                    const key = `${e.evento_id}_${e.ministerio_id}`;
                    const cols = colegas[key] || [];
                    return (
                      <EscalaCard
                        key={e.id}
                        escala={{
                          id: e.id,
                          titulo: e.titulo,
                          data: e.data,
                          horario: e.horario,
                          ministerio: e.ministerio,
                          icone: e.icone,
                          funcao: e.funcao,
                          status: e.status,
                        }}
                        colegas={cols.map((c: any) => ({ nome: c.nome, funcao: c.funcao }))}
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
