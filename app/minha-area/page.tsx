import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ClipboardList } from "lucide-react";
import Header from "@/components/header";
import { EscalaCard } from "./escala-card";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { PushNotificationRegister } from "@/components/push-notification-register";
import { TrocasPendentes } from "./trocas-pendentes";

export default async function MinhaAreaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const eventos = await sql`
    SELECT e.id, e.titulo, e.data, e.horario, e.observacoes,
           CASE WHEN es.user_id IS NOT NULL THEN true ELSE false END as is_escalado,
           es.id as escala_id, es.funcao as minha_funcao, es.status as meu_status, es.observacao as minha_observacao,
           es.ministerio_id as meu_ministerio_id,
           m.nome as ministerio, m.icone, m.cor
    FROM eventos e
    LEFT JOIN escalas es ON es.evento_id = e.id AND es.user_id = ${userId}
    LEFT JOIN ministerios m ON m.id = es.ministerio_id
    WHERE e.data >= CURRENT_DATE
    ORDER BY e.data ASC
    LIMIT 10
  `;

  const eventoIds = eventos.map((e: any) => e.id);
  let colegasPorEvento: Record<string, any[]> = {};
  if (eventoIds.length > 0) {
    const colegasRows = await sql`
      SELECT e.evento_id, u.id as user_id, u.nome, u.foto_url, e.funcao, m.nome as ministerio
      FROM escalas e
      JOIN users u ON u.id = e.user_id
      JOIN ministerios m ON m.id = e.ministerio_id
      WHERE e.evento_id = ANY(${eventoIds})
      ORDER BY m.nome, u.nome
    `;
    for (const c of colegasRows) {
      if (!colegasPorEvento[c.evento_id]) colegasPorEvento[c.evento_id] = [];
      colegasPorEvento[c.evento_id].push({
        user_id: c.user_id,
        nome: c.nome,
        foto_url: c.foto_url,
        funcao: c.funcao,
        ministerio: c.ministerio,
      });
    }
  }

  const pendentes = eventos.filter(
    (e: any) => e.is_escalado && e.meu_status === "pendente",
  ).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <PullToRefresh>
        <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
          <PushNotificationRegister />

          <TrocasPendentes />

          {pendentes > 0 && (
            <p className="text-[13px] text-gray-500">
              Você tem{" "}
              <span className="font-semibold text-orange-600">{pendentes}</span>{" "}
              escala{pendentes > 1 ? "s" : ""} pendente{pendentes > 1 ? "s" : ""}
            </p>
          )}

          <Card className="rounded-2xl border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <ClipboardList className="h-4 w-4 text-gray-500" />
                Minhas Escalas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-500">Nenhuma escala futura</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {eventos.map((e: any, i: number) => (
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
                        ministerio_id: e.meu_ministerio_id,
                        icone: e.icone,
                      }}
                      colegas={colegasPorEvento[e.id] || []}
                      userName={session.user.name?.split(" ")[0] || ""}
                      isNext={i === 0}
                    />
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
